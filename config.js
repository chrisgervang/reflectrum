System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ],
    "blacklist": []
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "src/main.js",
      "npm:babel-runtime@5.8.35/helpers/to-consumable-array",
      "npm:babel-runtime@5.8.35/core-js/object/assign",
      "npm:react@0.14.7",
      "npm:react-dom@0.14.7",
      "src/components/ViewStack.js",
      "src/components/MainMenu.js",
      "src/helpers/pages.js",
      "npm:redux@3.3.1",
      "npm:react-redux@4.4.0",
      "npm:react-router@1.0.3",
      "src/components/goodmorning/Opening.js",
      "npm:moment@2.11.2",
      "npm:babel-runtime@5.8.35/core-js/array/from",
      "npm:core-js@1.2.6/library/fn/object/assign",
      "npm:react@0.14.7/react",
      "npm:babel-runtime@5.8.35/helpers/get",
      "npm:react-dom@0.14.7/index",
      "npm:babel-runtime@5.8.35/helpers/class-call-check",
      "src/components/Standby.js",
      "npm:babel-runtime@5.8.35/helpers/inherits",
      "npm:babel-runtime@5.8.35/helpers/create-class",
      "src/components/menu/Menu.js",
      "npm:moment@2.11.2/moment",
      "src/components/ScreensaverMenu.js",
      "src/components/TetrisScreensaver.js",
      "src/components/MapScreensaver.js",
      "src/components/LockscreenScreensaver.js",
      "src/helpers/events.js",
      "src/components/common/Greeting.js",
      "src/components/quotes/Quotes.js",
      "src/components/common/Clock.js",
      "npm:react-router@1.0.3/lib/index",
      "npm:react-redux@4.4.0/lib/index",
      "src/components/clock/AnalogClock.js",
      "src/components/calendar/calendar.js",
      "src/components/weather/Weather.js",
      "npm:redux@3.3.1/lib/index",
      "npm:core-js@1.2.6/library/modules/$.core",
      "npm:react@0.14.7/lib/React",
      "npm:core-js@1.2.6/library/modules/es6.object.assign",
      "npm:core-js@1.2.6/library/fn/array/from",
      "npm:react@0.14.7/lib/ReactDOM",
      "npm:babel-runtime@5.8.35/core-js/object/get-own-property-descriptor",
      "src/components/menu/MenuList.js",
      "npm:babel-runtime@5.8.35/core-js/object/create",
      "npm:react-router@1.0.3/lib/Link",
      "npm:react-router@1.0.3/lib/RouteContext",
      "npm:react-router@1.0.3/lib/PropTypes",
      "npm:babel-runtime@5.8.35/core-js/object/define-property",
      "npm:babel-runtime@5.8.35/core-js/object/set-prototype-of",
      "src/components/tetris/Tetris.js",
      "src/components/map/Map.js",
      "src/components/common/Icon.js",
      "npm:fbemitter@2.0.2",
      "npm:react-router@1.0.3/lib/IndexLink",
      "npm:react-router@1.0.3/lib/History",
      "src/components/lockscreen/Lockscreen.js",
      "npm:react-router@1.0.3/lib/IndexRedirect",
      "npm:react-router@1.0.3/lib/IndexRoute",
      "npm:react-router@1.0.3/lib/Redirect",
      "npm:react-router@1.0.3/lib/Route",
      "npm:react-router@1.0.3/lib/Lifecycle",
      "npm:react-router@1.0.3/lib/RouteUtils",
      "npm:react-router@1.0.3/lib/RoutingContext",
      "npm:react-redux@4.4.0/lib/components/Provider",
      "npm:react-router@1.0.3/lib/Router",
      "npm:react-router@1.0.3/lib/useRoutes",
      "npm:redux@3.3.1/lib/createStore",
      "npm:react-router@1.0.3/lib/match",
      "npm:react-redux@4.4.0/lib/components/connect",
      "npm:redux@3.3.1/lib/bindActionCreators",
      "npm:redux@3.3.1/lib/compose",
      "npm:redux@3.3.1/lib/utils/warning",
      "npm:redux@3.3.1/lib/applyMiddleware",
      "github:jspm/nodelibs-process@0.1.2",
      "npm:redux@3.3.1/lib/combineReducers",
      "src/components/menu/Menu.css!github:systemjs/plugin-css@0.1.20",
      "src/components/clock/clock.css!github:systemjs/plugin-css@0.1.20",
      "src/components/calendar/calendar.css!github:systemjs/plugin-css@0.1.20",
      "src/components/weather/Weather.css!github:systemjs/plugin-css@0.1.20",
      "src/components/lockscreen/Lockscreen.css!github:systemjs/plugin-css@0.1.20",
      "npm:react@0.14.7/lib/Object.assign",
      "npm:react@0.14.7/lib/ReactDOMServer",
      "npm:core-js@1.2.6/library/modules/$.object-assign",
      "npm:core-js@1.2.6/library/modules/es6.string.iterator",
      "npm:core-js@1.2.6/library/modules/$.export",
      "npm:react@0.14.7/lib/ReactIsomorphic",
      "npm:react@0.14.7/lib/deprecated",
      "npm:react@0.14.7/lib/ReactCurrentOwner",
      "npm:react@0.14.7/lib/ReactVersion",
      "npm:fbjs@0.6.1/lib/ExecutionEnvironment",
      "npm:core-js@1.2.6/library/modules/es6.array.from",
      "npm:react@0.14.7/lib/ReactReconciler",
      "npm:react@0.14.7/lib/renderSubtreeIntoContainer",
      "src/components/menu/MenuListItem.js",
      "src/components/menu/MenuListSelectedItem.js",
      "npm:core-js@1.2.6/library/fn/object/get-own-property-descriptor",
      "npm:core-js@1.2.6/library/fn/object/create",
      "npm:react@0.14.7/lib/ReactDOMTextComponent",
      "npm:react@0.14.7/lib/ReactPerf",
      "npm:fbjs@0.6.1/lib/warning",
      "npm:react@0.14.7/lib/ReactDefaultInjection",
      "npm:react@0.14.7/lib/ReactMount",
      "npm:react@0.14.7/lib/ReactInstanceHandles",
      "npm:react@0.14.7/lib/ReactUpdates",
      "npm:react@0.14.7/lib/findDOMNode",
      "src/helpers/icons.js",
      "npm:history@1.17.0/lib/Actions",
      "npm:react-redux@4.4.0/lib/utils/shallowEqual",
      "github:casesandberg/reactcss@1.0.0",
      "github:maxdow/skycons@master",
      "src/helpers/weather.js",
      "npm:core-js@1.2.6/library/fn/object/set-prototype-of",
      "npm:core-js@1.2.6/library/fn/object/define-property",
      "src/helpers/location.js",
      "src/components/common/Row.js",
      "npm:fbemitter@2.0.2/index",
      "npm:babel-runtime@5.8.35/helpers/extends",
      "npm:warning@2.1.0",
      "npm:invariant@2.2.0",
      "npm:react-router@1.0.3/lib/getRouteParams",
      "npm:react-router@1.0.3/lib/computeChangedRoutes",
      "npm:react-router@1.0.3/lib/TransitionUtils",
      "npm:react-router@1.0.3/lib/getComponents",
      "npm:react-router@1.0.3/lib/isActive",
      "npm:lodash@4.3.0/isPlainObject",
      "npm:history@1.17.0/lib/useBasename",
      "src/components/lockscreen/WeatherStamp.js",
      "npm:react-redux@4.4.0/lib/utils/storeShape",
      "npm:react-router@1.0.3/lib/PatternUtils",
      "npm:history@1.17.0/lib/createHashHistory",
      "npm:history@1.17.0/lib/useQueries",
      "npm:react-router@1.0.3/lib/matchRoutes",
      "npm:history@1.17.0/lib/createMemoryHistory",
      "npm:react-redux@4.4.0/lib/utils/wrapActionCreators",
      "npm:hoist-non-react-statics@1.0.5",
      "github:jspm/nodelibs-process@0.1.2/index",
      "src/components/lockscreen/WeatherStamp.css!github:systemjs/plugin-css@0.1.20",
      "npm:core-js@1.2.6/library/modules/$",
      "npm:core-js@1.2.6/library/modules/$.to-object",
      "npm:core-js@1.2.6/library/modules/$.iobject",
      "npm:core-js@1.2.6/library/modules/$.fails",
      "npm:core-js@1.2.6/library/modules/$.global",
      "npm:react@0.14.7/lib/escapeTextContentForBrowser",
      "npm:core-js@1.2.6/library/modules/$.string-at",
      "npm:core-js@1.2.6/library/modules/$.iter-define",
      "npm:core-js@1.2.6/library/modules/$.ctx",
      "npm:core-js@1.2.6/library/modules/$.iter-call",
      "npm:core-js@1.2.6/library/modules/$.is-array-iter",
      "npm:core-js@1.2.6/library/modules/$.to-length",
      "npm:core-js@1.2.6/library/modules/core.get-iterator-method",
      "npm:core-js@1.2.6/library/modules/$.iter-detect",
      "npm:core-js@1.2.6/library/modules/es6.object.get-own-property-descriptor",
      "npm:react@0.14.7/lib/ReactElement",
      "npm:react@0.14.7/lib/ReactRef",
      "npm:react@0.14.7/lib/ReactComponentBrowserEnvironment",
      "npm:react@0.14.7/lib/ReactServerRendering",
      "npm:react@0.14.7/lib/ReactComponent",
      "npm:react@0.14.7/lib/ReactChildren",
      "npm:react@0.14.7/lib/ReactClass",
      "npm:react@0.14.7/lib/ReactDOMFactories",
      "npm:react@0.14.7/lib/ReactElementValidator",
      "npm:react@0.14.7/lib/ReactPropTypes",
      "npm:react@0.14.7/lib/onlyChild",
      "npm:react@0.14.7/lib/DOMChildrenOperations",
      "npm:react@0.14.7/lib/DOMPropertyOperations",
      "npm:react@0.14.7/lib/setTextContent",
      "npm:fbjs@0.6.1/lib/emptyFunction",
      "npm:react@0.14.7/lib/ClientReactRootIndex",
      "npm:react@0.14.7/lib/ServerReactRootIndex",
      "npm:react@0.14.7/lib/ReactEmptyComponentRegistry",
      "npm:react@0.14.7/lib/ReactDOMFeatureFlags",
      "npm:react@0.14.7/lib/ReactInstanceMap",
      "npm:react@0.14.7/lib/shouldUpdateReactComponent",
      "npm:react@0.14.7/lib/ReactRootIndex",
      "npm:react@0.14.7/lib/ReactInjection",
      "npm:react@0.14.7/lib/ReactReconcileTransaction",
      "npm:react@0.14.7/lib/SVGDOMPropertyConfig",
      "npm:react@0.14.7/lib/ReactMarkupChecksum",
      "npm:fbjs@0.6.1/lib/containsNode",
      "npm:react@0.14.7/lib/ReactBrowserEventEmitter",
      "npm:fbjs@0.6.1/lib/emptyObject",
      "npm:fbjs@0.6.1/lib/invariant",
      "npm:react@0.14.7/lib/validateDOMNesting",
      "npm:react@0.14.7/lib/BeforeInputEventPlugin",
      "npm:react@0.14.7/lib/ChangeEventPlugin",
      "npm:react@0.14.7/lib/DefaultEventPluginOrder",
      "npm:react@0.14.7/lib/EnterLeaveEventPlugin",
      "npm:react@0.14.7/lib/ReactBrowserComponentMixin",
      "npm:react@0.14.7/lib/HTMLDOMPropertyConfig",
      "npm:react@0.14.7/lib/ReactDefaultBatchingStrategy",
      "npm:react@0.14.7/lib/ReactEventListener",
      "npm:react@0.14.7/lib/ReactDOMComponent",
      "npm:react@0.14.7/lib/SelectEventPlugin",
      "npm:react@0.14.7/lib/SimpleEventPlugin",
      "npm:react@0.14.7/lib/ReactDefaultPerf",
      "npm:react@0.14.7/lib/DOMProperty",
      "npm:react@0.14.7/lib/ReactUpdateQueue",
      "npm:react@0.14.7/lib/instantiateReactComponent",
      "npm:react@0.14.7/lib/setInnerHTML",
      "npm:react@0.14.7/lib/CallbackQueue",
      "npm:react@0.14.7/lib/Transaction",
      "npm:react@0.14.7/lib/PooledClass",
      "src/helpers/jsonpc.js",
      "github:maxdow/skycons@master/skycons",
      "npm:react-router@1.0.3/lib/AsyncUtils",
      "npm:lodash@4.3.0/_isHostObject",
      "npm:history@1.17.0/lib/ExecutionEnvironment",
      "npm:lodash@4.3.0/isObjectLike",
      "npm:history@1.17.0/lib/extractPath",
      "npm:history@1.17.0/lib/deprecate",
      "npm:history@1.17.0/lib/DOMUtils",
      "github:casesandberg/reactcss@1.0.0/lib/react-css",
      "npm:babel-runtime@5.8.35/core-js/promise",
      "npm:core-js@1.2.6/library/modules/es6.object.set-prototype-of",
      "npm:query-string@3.0.0",
      "npm:history@1.17.0/lib/createHistory",
      "npm:invariant@2.2.0/browser",
      "npm:warning@2.1.0/browser",
      "npm:history@1.17.0/lib/runTransitionHook",
      "npm:history@1.17.0/lib/parsePath",
      "npm:history@1.17.0/lib/DOMStateStorage",
      "npm:history@1.17.0/lib/createDOMHistory",
      "npm:fbemitter@2.0.2/lib/BaseEventEmitter",
      "npm:hoist-non-react-statics@1.0.5/index",
      "npm:process@0.11.2",
      "npm:core-js@1.2.6/library/modules/$.cof",
      "npm:core-js@1.2.6/library/modules/$.to-integer",
      "npm:core-js@1.2.6/library/modules/$.defined",
      "npm:core-js@1.2.6/library/modules/$.library",
      "npm:core-js@1.2.6/library/modules/$.has",
      "npm:core-js@1.2.6/library/modules/$.iterators",
      "npm:core-js@1.2.6/library/modules/$.a-function",
      "npm:react@0.14.7/lib/ReactServerBatchingStrategy",
      "npm:fbjs@0.6.1/lib/keyOf",
      "npm:fbjs@0.6.1/lib/mapObject",
      "npm:react@0.14.7/lib/getIteratorFn",
      "npm:core-js@1.2.6/library/modules/$.hide",
      "npm:core-js@1.2.6/library/modules/$.redefine",
      "npm:core-js@1.2.6/library/modules/$.iter-create",
      "npm:core-js@1.2.6/library/modules/$.set-to-string-tag",
      "npm:core-js@1.2.6/library/modules/$.wks",
      "npm:core-js@1.2.6/library/modules/$.an-object",
      "npm:core-js@1.2.6/library/modules/$.to-iobject",
      "npm:core-js@1.2.6/library/modules/$.classof",
      "npm:core-js@1.2.6/library/modules/$.object-sap",
      "npm:react@0.14.7/lib/canDefineProperty",
      "npm:react@0.14.7/lib/ReactPropTypeLocationNames",
      "npm:fbjs@0.6.1/lib/keyMirror",
      "npm:react@0.14.7/lib/ReactOwner",
      "npm:react@0.14.7/lib/ReactServerRenderingTransaction",
      "npm:react@0.14.7/lib/ReactDOMIDOperations",
      "npm:react@0.14.7/lib/ReactNoopUpdateQueue",
      "npm:react@0.14.7/lib/traverseAllChildren",
      "npm:react@0.14.7/lib/ReactPropTypeLocations",
      "npm:react@0.14.7/lib/Danger",
      "npm:react@0.14.7/lib/adler32",
      "npm:react@0.14.7/lib/ViewportMetrics",
      "npm:react@0.14.7/lib/isTextInputElement",
      "npm:react@0.14.7/lib/getEventTarget",
      "npm:fbjs@0.6.1/lib/getUnboundedScrollPosition",
      "npm:react@0.14.7/lib/ReactDOMButton",
      "npm:fbjs@0.6.1/lib/shallowEqual",
      "npm:fbjs@0.6.1/lib/getActiveElement",
      "npm:react@0.14.7/lib/getEventCharCode",
      "npm:react@0.14.7/lib/quoteAttributeValueForBrowser",
      "npm:react@0.14.7/lib/ReactEmptyComponent",
      "npm:fbjs@0.6.1/lib/isTextNode",
      "npm:react@0.14.7/lib/ReactEventEmitterMixin",
      "npm:react@0.14.7/lib/FallbackCompositionState",
      "npm:react@0.14.7/lib/SyntheticCompositionEvent",
      "npm:react@0.14.7/lib/SyntheticInputEvent",
      "npm:react@0.14.7/lib/SyntheticMouseEvent",
      "npm:react@0.14.7/lib/SyntheticClipboardEvent",
      "npm:react@0.14.7/lib/SyntheticKeyboardEvent",
      "npm:react@0.14.7/lib/SyntheticFocusEvent",
      "npm:react@0.14.7/lib/SyntheticTouchEvent",
      "npm:react@0.14.7/lib/SyntheticDragEvent",
      "npm:react@0.14.7/lib/SyntheticUIEvent",
      "npm:react@0.14.7/lib/SyntheticWheelEvent",
      "npm:fbjs@0.6.1/lib/EventListener",
      "npm:react@0.14.7/lib/ReactMultiChild",
      "npm:react@0.14.7/lib/ReactMultiChildUpdateTypes",
      "npm:react@0.14.7/lib/EventPluginHub",
      "npm:react@0.14.7/lib/ReactComponentEnvironment",
      "npm:react@0.14.7/lib/ReactInputSelection",
      "npm:react@0.14.7/lib/ReactNativeComponent",
      "npm:react@0.14.7/lib/EventConstants",
      "npm:react@0.14.7/lib/EventPluginRegistry",
      "npm:react@0.14.7/lib/isEventSupported",
      "npm:react@0.14.7/lib/EventPropagators",
      "npm:react@0.14.7/lib/SyntheticEvent",
      "npm:react@0.14.7/lib/AutoFocusUtils",
      "npm:react@0.14.7/lib/CSSPropertyOperations",
      "npm:react@0.14.7/lib/ReactDOMInput",
      "npm:react@0.14.7/lib/ReactDOMOption",
      "npm:react@0.14.7/lib/ReactDOMSelect",
      "npm:react@0.14.7/lib/ReactDOMTextarea",
      "npm:react@0.14.7/lib/ReactDefaultPerfAnalysis",
      "npm:fbjs@0.6.1/lib/performanceNow",
      "npm:react@0.14.7/lib/ReactCompositeComponent",
      "github:casesandberg/reactcss@1.0.0/lib/loopable",
      "npm:history@1.17.0/lib/AsyncUtils",
      "npm:fbjs@0.7.2/lib/emptyFunction",
      "npm:process@0.11.2/browser",
      "npm:deep-equal@1.0.1",
      "github:casesandberg/reactcss@1.0.0/lib/transform",
      "github:casesandberg/reactcss@1.0.0/lib/inline",
      "github:casesandberg/reactcss@1.0.0/lib/deprecated/Component",
      "github:casesandberg/reactcss@1.0.0/lib/components/Hover",
      "npm:core-js@1.2.6/library/fn/promise",
      "npm:core-js@1.2.6/library/modules/$.set-proto",
      "npm:history@1.17.0/lib/createLocation",
      "npm:fbemitter@2.0.2/lib/EmitterSubscription",
      "npm:query-string@3.0.0/index",
      "npm:fbjs@0.7.2/lib/invariant",
      "npm:fbemitter@2.0.2/lib/EventSubscriptionVendor",
      "npm:core-js@1.2.6/library/modules/$.property-desc",
      "npm:core-js@1.2.6/library/modules/$.uid",
      "npm:core-js@1.2.6/library/modules/$.is-object",
      "npm:core-js@1.2.6/library/modules/$.shared",
      "npm:core-js@1.2.6/library/modules/$.descriptors",
      "npm:fbjs@0.6.1/lib/createNodesFromMarkup",
      "npm:fbjs@0.6.1/lib/isNode",
      "npm:react@0.14.7/lib/getEventModifierState",
      "npm:react@0.14.7/lib/forEachAccumulated",
      "npm:fbjs@0.6.1/lib/focusNode",
      "npm:react@0.14.7/lib/CSSProperty",
      "npm:react@0.14.7/lib/getEventKey",
      "npm:fbjs@0.6.1/lib/camelizeStyleName",
      "npm:fbjs@0.6.1/lib/hyphenateStyleName",
      "npm:react@0.14.7/lib/dangerousStyleValue",
      "npm:fbjs@0.6.1/lib/getMarkupWrap",
      "npm:react@0.14.7/lib/ReactErrorUtils",
      "npm:react@0.14.7/lib/getTextContentAccessor",
      "npm:react@0.14.7/lib/ReactChildReconciler",
      "npm:react@0.14.7/lib/flattenChildren",
      "npm:react@0.14.7/lib/EventPluginUtils",
      "npm:react@0.14.7/lib/accumulateInto",
      "npm:react@0.14.7/lib/ReactDOMSelection",
      "npm:fbjs@0.6.1/lib/memoizeStringOnly",
      "npm:react@0.14.7/lib/LinkedValueUtils",
      "npm:fbjs@0.6.1/lib/performance",
      "npm:core-js@1.2.6/library/modules/es6.object.to-string",
      "npm:fbemitter@2.0.2/lib/EventSubscription",
      "npm:classnames@2.2.3",
      "npm:deep-equal@1.0.1/index",
      "github:casesandberg/reactcss@1.0.0/lib/combine",
      "npm:strict-uri-encode@1.1.0",
      "github:casesandberg/reactcss@1.0.0/lib/check-class-structure",
      "npm:lodash@3.10.1",
      "npm:core-js@1.2.6/library/modules/web.dom.iterable",
      "npm:core-js@1.2.6/library/modules/es6.promise",
      "npm:fbjs@0.6.1/lib/createArrayFromMixed",
      "npm:fbjs@0.6.1/lib/camelize",
      "npm:react@0.14.7/lib/getNodeForCharacterOffset",
      "npm:fbjs@0.6.1/lib/hyphenate",
      "npm:classnames@2.2.3/index",
      "npm:deep-equal@1.0.1/lib/keys",
      "npm:deep-equal@1.0.1/lib/is_arguments",
      "npm:core-js@1.2.6/library/modules/$.strict-new",
      "npm:strict-uri-encode@1.1.0/index",
      "npm:core-js@1.2.6/library/modules/$.same-value",
      "github:casesandberg/reactcss@1.0.0/lib/merge",
      "github:casesandberg/reactcss@1.0.0/lib/transform-mixins",
      "npm:core-js@1.2.6/library/modules/es6.array.iterator",
      "npm:core-js@1.2.6/library/modules/$.for-of",
      "npm:core-js@1.2.6/library/modules/$.species-constructor",
      "npm:lodash@3.10.1/index",
      "npm:core-js@1.2.6/library/modules/$.microtask",
      "npm:core-js@1.2.6/library/modules/$.redefine-all",
      "npm:core-js@1.2.6/library/modules/$.set-species",
      "npm:fbjs@0.6.1/lib/toArray",
      "npm:core-js@1.2.6/library/modules/$.add-to-unscopables",
      "npm:core-js@1.2.6/library/modules/$.iter-step",
      "npm:merge@1.2.0",
      "npm:core-js@1.2.6/library/modules/$.task",
      "npm:merge@1.2.0/merge",
      "npm:core-js@1.2.6/library/modules/$.invoke",
      "npm:core-js@1.2.6/library/modules/$.html",
      "npm:core-js@1.2.6/library/modules/$.dom-create"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.35",
    "babel-runtime": "npm:babel-runtime@5.8.35",
    "casesandberg/reactcss": "github:casesandberg/reactcss@1.0.0",
    "classnames": "npm:classnames@2.2.3",
    "clean-css": "npm:clean-css@3.4.10",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.20",
    "fbemitter": "npm:fbemitter@2.0.2",
    "lodash": "npm:lodash@3.10.1",
    "maxdow/skycons": "github:maxdow/skycons@master",
    "merge": "npm:merge@1.2.0",
    "moment": "npm:moment@2.11.2",
    "react": "npm:react@0.14.7",
    "react-addons": "npm:react-addons@0.9.1-deprecated",
    "react-addons-create-fragment": "npm:react-addons-create-fragment@0.14.7",
    "react-dom": "npm:react-dom@0.14.7",
    "react-redux": "npm:react-redux@4.4.0",
    "react-router": "npm:react-router@1.0.3",
    "reactcss": "github:casesandberg/reactcss@1.0.0",
    "redux": "npm:redux@3.3.1",
    "whatwg-fetch": "npm:whatwg-fetch@0.10.1",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-domain@0.1.0": {
      "domain-browser": "npm:domain-browser@1.1.7"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:asap@2.0.3": {
      "domain": "github:jspm/nodelibs-domain@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.35": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.0.5",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:clean-css@3.4.10": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.8.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.4.4",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.8.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:domain-browser@1.1.7": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:encoding@0.1.12": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "iconv-lite": "npm:iconv-lite@0.4.13"
    },
    "npm:fbemitter@2.0.2": {
      "fbjs": "npm:fbjs@0.7.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fbjs@0.6.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:fbjs@0.7.2": {
      "core-js": "npm:core-js@1.2.6",
      "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@7.1.1",
      "ua-parser-js": "npm:ua-parser-js@0.7.10"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:history@1.17.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "deep-equal": "npm:deep-equal@1.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "invariant": "npm:invariant@2.2.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "query-string": "npm:query-string@3.0.0",
      "warning": "npm:warning@2.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:invariant@2.2.0": {
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:isomorphic-fetch@2.2.1": {
      "node-fetch": "npm:node-fetch@1.3.3",
      "whatwg-fetch": "npm:whatwg-fetch@0.10.1"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash@4.3.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:loose-envify@1.1.0": {
      "js-tokens": "npm:js-tokens@1.0.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:moment@2.11.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:node-fetch@1.3.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "encoding": "npm:encoding@0.1.12",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:pako@0.2.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process-nextick-args@1.0.6": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:promise@7.1.1": {
      "asap": "npm:asap@2.0.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:query-string@3.0.0": {
      "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
    },
    "npm:react-addons-create-fragment@0.14.7": {
      "react": "npm:react@0.14.7"
    },
    "npm:react-addons@0.9.1-deprecated": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@0.14.7"
    },
    "npm:react-dom@0.14.7": {
      "react": "npm:react@0.14.7"
    },
    "npm:react-redux@4.4.0": {
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.0.5",
      "invariant": "npm:invariant@2.2.0",
      "lodash": "npm:lodash@4.3.0",
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@0.14.7",
      "redux": "npm:redux@3.3.1"
    },
    "npm:react-router@1.0.3": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "history": "npm:history@1.17.0",
      "invariant": "npm:invariant@2.2.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "warning": "npm:warning@2.1.0"
    },
    "npm:react@0.14.7": {
      "fbjs": "npm:fbjs@0.6.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@2.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@1.0.6",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:redux@3.3.1": {
      "lodash": "npm:lodash@4.3.0",
      "lodash-es": "npm:lodash-es@4.3.0",
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:source-map@0.4.4": {
      "amdefine": "npm:amdefine@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:ua-parser-js@0.7.10": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:warning@2.1.0": {
      "loose-envify": "npm:loose-envify@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
