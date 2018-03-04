@echo off
cd .git
IF EXIST index.lock (
    DEL index.lock
) ELSE (
    ECHO index.lock does not exist
)
cd ..