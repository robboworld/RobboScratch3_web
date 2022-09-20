#!/bin/bash

NODE_MOD=node_modules
current_dir=`pwd`
function check_inst {
  	hash $1 > /dev/null 2>&1 || { 
        echo "$1  не найден."
   	 echo "Простите, дальнейшая сборка невозможна"
	}
}
function check_dir {
    cd "$current_dir"
    if [ -r $1 ]; then
    echo "$1  существует."
    else
        echo "$1  не найден."
	read -p "Установить $1? y/n "  -r
	if [[ ! $REPLY =~ ^[Yy]$ ]]
	then
   	 echo "Простите, дальнейшая сборка невозможна"
	 exit
	else
	 git clone https://github.com/Yarila682/$1
	fi
   fi
}
function check_npm {
	cd "$current_dir/$1"
	if [ -r $NODE_MOD ]; then
	   echo "$1 '$NODE_MOD' существует."
	else
	   echo "$1 '$NODE_MOD' не найден."
   	read -p "Скачать node_modules $1? y/n "  -r
	if [[ ! $REPLY =~ ^[Yy]$ ]]
	then
   	 echo "Простите, дальнейшая сборка невозможна"
	 exit
	else
	 npm install
	fi
fi
}

# ПРОВЕРКА НА УСТАНОВЛЕННЫЙ NPM
echo
check_inst npm
check_inst node
check_inst git
check_dir robboscratch3_I10n
check_dir Robboscratch3_DeviceControlAPI
check_dir robboscratch3_vm
check_dir robboscratch3_blocks
check_dir robboscratch3_gui
echo
check_npm robboscratch3_I10n
check_npm Robboscratch3_DeviceControlAPI
check_npm robboscratch3_vm
check_npm robboscratch3_blocks
check_npm robboscratch3_gui
echo
while [ -n "$1" ]
do
case "$1" in

-blocks) echo "Found the -blocks option" 
cd "$current_dir/robboscratch3_blocks"
npm run prepublish
cp -R "$current_dir/robboscratch3_blocks/dist" "$current_dir/robboscratch3_gui/node_modules/scratch-blocks/dist"
cp -f "$current_dir/robboscratch3_blocks/package.json" "$current_dir/robboscratch3_gui/node_modules/scratch-blocks/package.json"
;;

-i10n) echo "Found the -i10n option" 
cd "$current_dir/robboscratch3_I10n"
npm run build
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-l10n/dist"
cp -R "$current_dir/robboscratch3_I10n/dist" "$current_dir/robboscratch3_gui/node_modules/scratch-l10n/dist"
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-l10n/locales"
cp -R "$current_dir/robboscratch3_I10n/locales" "$current_dir/robboscratch3_gui/node_modules/scratch-l10n/locales"
;;




-vm) echo "Found the -vm option" 
cd "$current_dir/robboscratch3_vm"
npm run build
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-vm/dist"
cp -R "$current_dir/robboscratch3_vm/dist" "$current_dir/robboscratch3_gui/node_modules/scratch-vm/dist"
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-vm/src"
cp -R "$current_dir/robboscratch3_vm/src" "$current_dir/robboscratch3_gui/node_modules/scratch-vm/src"
;;

-dca) echo "Found the -dca option" 
cd "$current_dir/Robboscratch3_DeviceControlAPI"
npm run build
rm -R "$current_dir/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/dist"
cp -R "$current_dir/Robboscratch3_DeviceControlAPI/dist" "$current_dir/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/dist"
rm -R "$current_dir/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/src"
cp -R "$current_dir/Robboscratch3_DeviceControlAPI/src" "$current_dir/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/src"
#cp -R "$current_dir/Robboscratch3_DeviceControlAPI" "$current_dir/robboscratch3_gui/node_modules"
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/dist"
cp -R "$current_dir/Robboscratch3_DeviceControlAPI/dist" "$current_dir/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/dist"
rm -R "$current_dir/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/src"
cp -R "$current_dir/Robboscratch3_DeviceControlAPI/src" "$current_dir/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/src"
;;

-gui) echo "Found the -gui option" 
cd "$current_dir/robboscratch3_gui"
npm run build
cd "$current_dir/robboscratch3_gui/build"
#sed '0a\' lib.min.js
#sed '0a\const node_fs = require("fs");' lib.min.js
sed -i -e '1 s/^/const _serialport = require("serialport");\n/;' lib.min.js
sed -i -e '1 s/^/const node_fs = require("fs");\n/;' lib.min.js
sed -i -e '1 s/^/const node_process = require("process");\n/;' lib.min.js
sed -i -e '1 s/^/const node_os = require("os");\n/;' lib.min.js
sed -i -e '1 s/^/const getos = require("getos")\n/;' lib.min.js
sed -i -e '1 s/^/const clipboardy = require("clipboardy")\n/;' lib.min.js
#cd  "$current_dir/robboscratch3_gui"
rm -R "$current_dir/nwjs_binary/build"
cp -R "$current_dir/robboscratch3_gui/build" "$current_dir/nwjs_binary/build"
;;

-inject_headers) echo "Found the --inject_headers option"
cd "$current_dir/robboscratch3_gui/build"
sed -i -e '1 s/^/const _serialport = require("serialport");\n/;' lib.min.js
sed -i -e '1 s/^/const node_fs = require("fs");\n/;' lib.min.js
sed -i -e '1 s/^/const node_process = require("process");\n/;' lib.min.js
sed -i -e '1 s/^/const node_os = require("os");\n/;' lib.min.js
sed -i -e '1 s/^/const getos = require("getos")\n/;' lib.min.js
sed -i -e '1 s/^/const clipboardy = require("clipboardy")\n/;' lib.min.js

;;

*) echo "$1 is not an option" ;;
esac
shift
done

