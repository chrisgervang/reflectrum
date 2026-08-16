import ApplicationServices
import CoreGraphics
import Foundation

private struct ButtonBinding {
    let buttonNumber: Int64
    let keyCode: CGKeyCode
    let name: String
}

private let bindings = [
    ButtonBinding(buttonNumber: 3, keyCode: 53, name: "Back / Escape"),
    ButtonBinding(buttonNumber: 4, keyCode: 36, name: "Forward / Return"),
    ButtonBinding(buttonNumber: 5, keyCode: 126, name: "Button 6 / Arrow Up"),
    ButtonBinding(buttonNumber: 6, keyCode: 125, name: "Button 7 / Arrow Down"),
]

private let bindingsByButton = Dictionary(uniqueKeysWithValues: bindings.map { ($0.buttonNumber, $0) })
private let repeatQueue = DispatchQueue(label: "io.reflectrum.dialpad.repeat")
private let repeatLock = NSLock()
private var repeatTimers: [Int64: DispatchSourceTimer] = [:]
private var eventTap: CFMachPort?

private func log(_ message: String) {
    let timestamp = ISO8601DateFormatter().string(from: Date())
    FileHandle.standardError.write(Data("\(timestamp) \(message)\n".utf8))
}

private func postKey(_ binding: ButtonBinding, keyDown: Bool, isRepeat: Bool = false) {
    guard let event = CGEvent(
        keyboardEventSource: CGEventSource(stateID: .hidSystemState),
        virtualKey: binding.keyCode,
        keyDown: keyDown
    ) else { return }
    if isRepeat {
        event.setIntegerValueField(.keyboardEventAutorepeat, value: 1)
    }
    event.post(tap: .cghidEventTap)
}

private func beginRepeat(for binding: ButtonBinding) {
    repeatLock.lock()
    defer { repeatLock.unlock() }
    guard repeatTimers[binding.buttonNumber] == nil else { return }

    let timer = DispatchSource.makeTimerSource(queue: repeatQueue)
    timer.schedule(deadline: .now() + .milliseconds(500), repeating: .milliseconds(80))
    timer.setEventHandler {
        postKey(binding, keyDown: true, isRepeat: true)
    }
    repeatTimers[binding.buttonNumber] = timer
    timer.resume()
}

private func endRepeat(for binding: ButtonBinding) {
    repeatLock.lock()
    let timer = repeatTimers.removeValue(forKey: binding.buttonNumber)
    repeatLock.unlock()
    timer?.cancel()
}

private func handleEvent(
    proxy: CGEventTapProxy,
    type: CGEventType,
    event: CGEvent,
    userInfo: UnsafeMutableRawPointer?
) -> Unmanaged<CGEvent>? {
    if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
        if let eventTap {
            CGEvent.tapEnable(tap: eventTap, enable: true)
        }
        return Unmanaged.passUnretained(event)
    }

    let buttonNumber = event.getIntegerValueField(.mouseEventButtonNumber)
    guard let binding = bindingsByButton[buttonNumber] else {
        return Unmanaged.passUnretained(event)
    }

    switch type {
    case .otherMouseDown:
        log("button \(buttonNumber) down -> \(binding.name)")
        postKey(binding, keyDown: true)
        beginRepeat(for: binding)
        return nil
    case .otherMouseUp:
        log("button \(buttonNumber) up -> \(binding.name)")
        endRepeat(for: binding)
        postKey(binding, keyDown: false)
        return nil
    default:
        return Unmanaged.passUnretained(event)
    }
}

private func runSelfTest() {
    let expected: [Int64: CGKeyCode] = [3: 53, 4: 36, 5: 126, 6: 125]
    precondition(bindingsByButton.count == expected.count)
    for (button, keyCode) in expected {
        precondition(bindingsByButton[button]?.keyCode == keyCode)
    }
    print("Reflectrum Dialpad mapping self-test passed.")
}

if CommandLine.arguments.contains("--self-test") {
    runSelfTest()
    exit(EXIT_SUCCESS)
}

let accessibilityOptions = [
    kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true,
] as CFDictionary
guard AXIsProcessTrustedWithOptions(accessibilityOptions) else {
    log("Accessibility permission is required for Reflectrum Dialpad.")
    exit(EXIT_FAILURE)
}

let eventMask = (CGEventMask(1) << CGEventType.otherMouseDown.rawValue)
    | (CGEventMask(1) << CGEventType.otherMouseUp.rawValue)

eventTap = CGEvent.tapCreate(
    tap: .cgSessionEventTap,
    place: .headInsertEventTap,
    options: .defaultTap,
    eventsOfInterest: eventMask,
    callback: handleEvent,
    userInfo: nil
)

guard let eventTap else {
    log("Input Monitoring permission is required for Reflectrum Dialpad.")
    exit(EXIT_FAILURE)
}

let runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, .commonModes)
CGEvent.tapEnable(tap: eventTap, enable: true)
log("Reflectrum Dialpad is listening for buttons 3, 4, 5, and 6.")
CFRunLoopRun()
