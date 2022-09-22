#!/usr/local/bin/v run

import os
import os.cmdline as cmd
import term

fn check_inst(util string) bool{
    exec_res:= execute_or_panic("${util} --version")

     if exec_res.exit_code != 0 {
       println("${util} is not installed.")
       println("Code: ${exec_res.exit_code}")
       println("Output: ${exec_res.output}")
       return false
    }

   println("Code: ${exec_res.exit_code}")
   println("Output: ${exec_res.output}")

   return true

}

fn check_dir(dir string, cur_dir string){

    //changes working directory
    chdir(cur_dir) 
    // or {
    //                println(term.fail_message("check_dir: Error: ${err}"))
                  
    //              }
   

    if exists(dir) {
        println("${dir} exists")
    }else{
        println(term.warn_message("${dir} not found"))
        println("Install? y/n")
        reply:= get_line()
        if !(reply in ["y","Y"]) {
           println(term.fail_message("Can't proceed build process"))
           exit(1)
        }else{
          println("git clone  https://github.com/Yarila682/${dir}")
          res:= execute("git clone https://github.com/Yarila682/${dir}") 
           if res.exit_code != 0 {
                println("Code: ${res.exit_code}")
                println("Output: ${res.output}")
                return
            }  
          println(res.output)
        }
    }
}

fn check_npm(dir string,cwd string){
   chdir("${cwd}/${dir}") 
  //  or {
  //                  println(term.fail_message("check_npm: Error: ${err}"))
                  
  //                }

   if exists("node_modules") {println("Dependecies of ${dir} are already installed")}
   else{
        println(term.warn_message("node_modules dir in ${dir}  not found"))
        println("Install dependencies? y/n")
        reply:= get_line()
        if !(reply in ["y","Y"]) {
           println(term.fail_message("Can't proceed build process"))
           exit(1)
        }else{
          println("npm install")
          res:= execute("npm install")

          if res.exit_code != 0 {
                println("Code: ${res.exit_code}")
                println("Output: ${res.output}")
                return
            }    

          println(res.output)
        }
   }
}

fn run_build(dir string,cwd string, cmd string){
     chdir("${cwd}/${dir}")  
    //  or {
    //                println(term.fail_message("run_build: Error: ${err}"))
                  
    //              }
     res:= execute_or_panic("npm run ${cmd}")
     println(res.output)
}

fn cp_with_filter(source string, dest string, filter []string){
  ls_output:= ls(source) or {
     println(term.fail_message("cp_with_filter: Error: ${err}"))
     exit(1)
  }
  for item in ls_output {
    if !(item in filter){
        println("Copy ${item}")
        if is_dir("${source}/${item}") {

          if !exists("${dest}/${item}") {
            mkdir("${dest}/${item}") or {
                   println(term.fail_message("cp_with_filter (mkdir folder): Error: ${err}"))
                   exit(1)
                 }
           }

           cp_all("${source}/${item}","${dest}/${item}/",true) or {
             println(term.fail_message("cp_with_filter (folder): Error: ${err}"))
             println("source: ${source}")
             println("dest: ${dest}")
             println("item: ${item} ")
             exit(1)
          }
      }else{

        cp_all("${source}/${item}","${dest}/${item}",true) or {
             println(term.fail_message("cp_with_filter (file): Error: ${err}"))
             println("source: ${source}")
             println("dest: ${dest}")
             println("item: ${item} ")
             exit(1)
        }
      }

    }
  }
}

cwd := getwd()
//println("Current dir: ${cwd}")

if !check_inst("git") { panic("Can't proceed build process") }

if !check_inst("node") { panic("Can't proceed build process") }

if !check_inst("npm") { panic("Can't proceed build process") }

check_dir("robboscratch3_I10n",cwd)
check_dir("Robboscratch3_DeviceControlAPI",cwd)
check_dir("robboscratch3_vm",cwd)
check_dir("robboscratch3_blocks",cwd)
check_dir("robboscratch3_gui",cwd)

check_npm("robboscratch3_I10n",cwd)
check_npm("Robboscratch3_DeviceControlAPI",cwd)
check_npm("robboscratch3_vm",cwd)
check_npm("robboscratch3_blocks",cwd)
check_npm("robboscratch3_gui",cwd)


println(os.args)
options:= cmd.only_options(os.args)
println(options)

for option in options{
    match option {
      "-dca" {
            println(term.ok_message("Found -dca option."))
            run_build("Robboscratch3_DeviceControlAPI",cwd,"build")

            if !exists("${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI"){
                 println(term.warn_message("Module Robboscratch3_DeviceControlAPI not found in ${cwd}/robboscratch3_vm/node_modules"))
                 println("Creating...")
                 mkdir("${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI") or {
                   println(term.fail_message("Error: ${err}"))
                   exit(1)
                 }
                 filtered_files:= [".git","node_modules"]
                 cp_with_filter("${cwd}/Robboscratch3_DeviceControlAPI","${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI",filtered_files)

            }else{
              println("Replacing dist and src folders in ${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI")
              if exists("${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/dist"){
                 rmdir_all("${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/dist") or {
                   println(term.fail_message("dist (dca):  Error: ${err}"))
                   //exit(1)
                  }
                 rmdir_all("${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI/src") or {
                   println(term.fail_message("src (dca): Error: ${err}"))
                   //exit(1)
                  }

                   filtered_files:= [".git","node_modules"]
                   cp_with_filter("${cwd}/Robboscratch3_DeviceControlAPI","${cwd}/robboscratch3_vm/node_modules/Robboscratch3_DeviceControlAPI",filtered_files)

              }

            }


          if !exists("${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI"){
                println(term.warn_message("Module Robboscratch3_DeviceControlAPI not found in ${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules"))
                println("Creating...")
                mkdir("${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI") or {
                   println(term.fail_message("Error: ${err}"))
                   exit(1)
                 }
                 filtered_files:= [".git","node_modules"]
                 cp_with_filter("${cwd}/Robboscratch3_DeviceControlAPI","${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI",filtered_files)

          }else{

              println("Replacing dist and src folders in ${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI")
              if exists("${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/dist"){
                 rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/dist") or {
                   println(term.fail_message("dist (dca):  Error: ${err}"))
                   //exit(1)
                  }
                 rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI/src") or {
                   println(term.fail_message("src (dca): Error: ${err}"))
                   //exit(1)
                  }

                 filtered_files:= [".git","node_modules"]
                 cp_with_filter("${cwd}/Robboscratch3_DeviceControlAPI","${cwd}/robboscratch3_gui/node_modules/scratch-vm/node_modules/Robboscratch3_DeviceControlAPI",filtered_files)

              }

          }


      }
      "-vm" {
            println(term.ok_message("Found -vm option."))
            run_build("robboscratch3_vm",cwd,"build")

            rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-vm/dist") or {
                   println(term.fail_message("dist (vm):  Error: ${err}"))
                   //exit(1)
                  }
           rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-vm/src") or {
                   println(term.fail_message("src (vm): Error: ${err}"))
                   //exit(1)
                  }

//           rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-vm/") or {
//                     println(term.fail_message("(vm): Error: ${err}"))
//                     //exit(1)
//                    }

//           mkdir("${cwd}/robboscratch3_gui/node_modules/scratch-vm") or {
//                    println(term.fail_message("(vm) Error: ${err}"))
//                    exit(1)
//                  }

           filtered_files:= [".git","node_modules","test","playground"]
           cp_with_filter("${cwd}/robboscratch3_vm","${cwd}/robboscratch3_gui/node_modules/scratch-vm",filtered_files)
           //cp_all("${cwd}/robboscratch3_vm","${cwd}/robboscratch3_gui/node_modules/scratch-vm",true)


      }
      "-i10n" {
            println(term.ok_message("Found -i10n option."))
            run_build("robboscratch3_I10n",cwd,"build")

           rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-l10n") or {
                    println(term.fail_message("(i10n): Error: ${err}"))
                    //exit(1)
                   }

          mkdir("${cwd}/robboscratch3_gui/node_modules/scratch-l10n") or {
                   println(term.fail_message("(i10n) Error: ${err}"))
                   exit(1)
                 }

           filtered_files:= [".git","node_modules"]
           cp_with_filter("${cwd}/robboscratch3_I10n","${cwd}/robboscratch3_gui/node_modules/scratch-l10n",filtered_files)

      }
      "-blocks" {
           println(term.ok_message("Found -blocks option."))
           run_build("robboscratch3_blocks",cwd,"prepublish")

           rmdir_all("${cwd}/robboscratch3_gui/node_modules/scratch-blocks") or {
                    println(term.fail_message("(blocks): Error: ${err}"))
                    //exit(1)
                   }

          mkdir("${cwd}/robboscratch3_gui/node_modules/scratch-blocks") or {
                   println(term.fail_message("(blocks) Error: ${err}"))
                   exit(1)
                 }

           filtered_files:= [".git","node_modules"]
           cp_with_filter("${cwd}/robboscratch3_blocks","${cwd}/robboscratch3_gui/node_modules/scratch-blocks",filtered_files)

      }
      "-gui" {
           println(term.ok_message("Found -gui option."))
           run_build("robboscratch3_gui",cwd,"build")

           chdir("${cwd}/robboscratch3_gui/build")
            // or {
            //        println(term.fail_message("(gui): Error: ${err}"))
                  
            //      }

//            mut f:= open_file("${cwd}/robboscratch3_gui/build/lib.min.js","e")  or {
//                  println(term.fail_message("(gui): Error: ${err}"))
//                  exit(1)
//            }

//             mut f:= open_append("${cwd}/robboscratch3_gui/build/lib.min.js")  or {
//                  println(term.fail_message("(gui): Error: ${err}"))
//                  exit(1)
//            }

//            str:= 'const _serialport = require("serialport");'

//             f.seek(50)
//             f.writeln(str)


//            mut bytes_written:= f.write_bytes_at(&str, int(sizeof(str)), 1)

//            println("bytes written: ${bytes_written}")

         mut str:= '1 s/^/const _serialport = require("serialport");/;'

         mut res:= execute("sed -i -e '${str}' lib.min.js")  
                   if res.exit_code != 0 {
                    println(term.fail_message("(gui): Error: ${res.output}"))
                    exit(1)
                  }
         println(res.output)

        str = '1 s/^/const node_fs = require("fs");/;'
        res= execute("sed -i -e '${str}' lib.min.js")  
             if res.exit_code != 0 {
                   println(term.fail_message("(gui): Error: ${res.output}"))
                   exit(1)
              }
       println(res.output)

       str = '1 s/^/const node_process = require("process");/;'
       res= execute("sed -i -e '${str}' lib.min.js")  
                 if res.exit_code != 0 {
                   println(term.fail_message("(gui): Error: ${res.output}"))
                   exit(1)
                  }
       println(res.output)

       str = '1 s/^/const node_os = require("os");/;'
       res= execute("sed -i -e '${str}' lib.min.js")  
                  if res.exit_code != 0 {  
                   println(term.fail_message("(gui): Error: ${res.output}"))
                   exit(1)
                  }
       println(res.output)

       str = '1 s/^/const getos = require("getos");/;'
       res= execute("sed -i -e '${str}' lib.min.js")  
                if res.exit_code != 0 {
                   println(term.fail_message("(gui): Error: ${res.output}"))
                   exit(1)
                  }
       println(res.output)

       str = '1 s/^/const clipboardy = require("clipboardy");/;'
       res= execute("sed -i -e '${str}' lib.min.js")  
                if res.exit_code != 0 {
                   println(term.fail_message("(gui): Error: ${res.output}"))
                   exit(1)
                  }
       println(res.output)


       rmdir_all("${cwd}/nwjs_binary/package.nw/build") or {
                    println(term.fail_message("(gui): Error: ${err}"))
                    //exit(1)
                   }

      mkdir("${cwd}/nwjs_binary/package.nw/build") or {
                   println(term.fail_message("(gui) Error: ${err}"))
                   exit(1)
                 }

     //filtered_files:= [".git","node_modules"]
     cp_all("${cwd}/robboscratch3_gui/build","${cwd}/nwjs_binary/package.nw/build",true) or {
                   println(term.fail_message("(gui) Error: ${err}"))
                 
                 }


      }
      else{
            println("Bad option: ${option}")
            println("Available options: -dca -blocks -vm -i10n -gui")
      }
    }
}

if options.len == 0 {
   println("No options found")
   println("Available options: -dca -blocks -vm -i10n -gui")
}


