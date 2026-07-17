#!/usr/bin/env bash

source "$1"

if [ ${#TESTS[@]} -eq 0 ]; then
    echo "No se encontraron casos de prueba."
    exit 1
fi

for test in "${TESTS[@]}"; do
    IFS="|" read -r title command <<< "$test"

    echo
    echo "========================================================="
    echo "$title"
    echo "---------------------------------------------------------"
    echo "\$ $command"

    eval "$command"

    echo
done