#!/bin/bash

input_flag="$1"
if [[ $(( ${input_flag} & 2#0001000 )) != 0 ]]; then
  ## Install bluetooth GUI
  echo hi
fi

if [[ $(( ${input_flag} & 2#0000100 )) != 0 ]]; then
  ## Install bluetooth GUI
  echo hi
fi

if [[ $(( ${input_flag} & 2#0000010 )) != 0 ]]; then
  ## Install bluetooth GUI
  echo hi
fi

if [[ $(( ${input_flag} & 2#0000001 )) != 0 ]]; then
  ## Install bluetooth GUI
  echo hi
fi
