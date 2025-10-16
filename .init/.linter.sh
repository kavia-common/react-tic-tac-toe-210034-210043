#!/bin/bash
cd /home/kavia/workspace/code-generation/react-tic-tac-toe-210034-210043/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

