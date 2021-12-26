const fs = require("fs");
const readline = require("readline");

const task = 'task.txt';
const done = 'completed.txt';

fs.appendFile(task, "", (err) => {
    if (err) {
        console.log(err);
    }
})

deleteTask = (id) => {
    var rd = readline.createInterface({
        input: fs.createReadStream(task)
    });
    let i = 1;
    rd.on('line', (line) => {
        if (i == parseInt(id)) {
            fs.readFile(task, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    throw err
                };
                var arr = data.split('\n');
                fs.writeFile(task, data.replace(arr[parseInt(id) - 1] + '\n', ""), 'utf8', () => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });
            })
        }
        i++;
    });
}

addTask = (priority, _task) => {
    fs.readFile(task, 'utf8', (err, data) => {

        if (!data.match(`${_task}\n`)) {
            fs.appendFile(task, `${priority} ${_task}\n`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}

doneTask = (id) => {
    var rd = readline.createInterface({
        input: fs.createReadStream(task)
    });
    let i = 1;
    rd.on('line', (line) => {
        if (i == parseInt(id)) {
            data = line.substring(1)
            fs.appendFile(done, ` ${data} \n`, (err, res) => {
                fs.readFile(task, (err, data) => {
                    if (err) {
                        console.info(err);
                    }
                    else {
                        console.info(`Marked item as done.`);
                    }
                });
            });

            fs.readFile(task, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    throw err
                };
                var arr = data.split('\n');
                fs.writeFile(task, data.replace(arr[parseInt(id) - 1] + '\n', ""), 'utf8', () => {
                    if (err) {
                        console.log(err);
                        throw err
                    };
                });
            })
        }
        i++;
    });
}

getReport = () => {
    fs.readFile(task, 'utf8', (err, data) => {
        if (err) throw err;

        var lines1 = data.split("\n");
        let rem = lines1.length;

        fs.readFile(done, 'utf8', (err, data) => {
            if (err) throw err;

            var lines = data.split("\n");
            let com = lines.length;

            console.log(`Pending : ${rem - 1}`)
            for (let i = 1; i < lines1.length; i++) {
                let priority = lines1[i - 1].split(' ')[0]
                let task = lines1[i - 1].substring(2)
                console.log(`${i}. ${task} [${priority}]`);
            }
            console.log(`Completed : ${com - 1}`)
            for (let i = 1; i < lines.length; i++) {
                let task = lines[i - 1].substring(2)
                console.info(`${i}. ${task}`);
            }

        });
    });
}



printTasks = () => {
    fs.readFile(task, 'utf8', (err, data) => {
        if (err) throw err;

        var lines = data.split('\n');
        if (lines.length == 1 || lines.length == 0) {
            console.log(`There are no pending tasks!`);
        }
        else {
            for (let i = 1; i < lines.length; i++) {
                let priority = lines[i - 1].split(' ')[0]
                let task = lines[i - 1].substring(2)
                console.log(`${i}. ${task} [${priority}]`);
            }
        }
    })
}

printHelp = () => {
    console.log(`Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`);
}


var arg = process.argv;
//console.log(arg)


// to add the new task
if (arg[2] == 'add') {
    if (arg[3] === undefined || arg[4] === undefined) {
        console.info('Error: Missing tasks string. Nothing added!');
    }
    else {
        addTask(arg[3], arg[4]);
        console.log(`Added task: "${arg[4]}" with priority ${arg[3]}`);
    }
}

//print help when non arg is provided
if (arg[2] == undefined) {
    printHelp();
}

//print help
if (arg[2] == "help") {
    printHelp();
}

//delete task
if (arg[2] == "del") {
    if (arg[3] === undefined) {
        console.info('Error: Missing NUMBER for deleting tasks.');
    }
    else {
        fs.readFile(task, 'utf8', (err, data) => {
            if (err) throw err;

            var lines = data.split("\n");
            if (lines.length <= arg[3] || arg[3] == 0) {
                console.info(`Error: task with index #${arg[3]} does not exist. Nothing deleted.`);
            }
            else {
                deleteTask(arg[3]);
                console.log(`Deleted task #${arg[3]}`)
            }
        })

    }
}

//complete task
if (arg[2] == "done") {
    if (arg[3] === undefined) {
        console.info('Error: Missing NUMBER for marking tasks as done.');
    }
    else {
        fs.readFile(task, 'utf8', (err, data) => {
            if (err) throw err;

            var lines = data.split("\n");
            if (lines.length <= arg[3] || arg[3] == 0) {
                console.info(`Error: no incomplete item with index #${arg[3]} exists.`);
            }
            else
                doneTask(arg[3]);
        })
    }
}

//list all pending task
if (arg[2] == "ls") {
    printTasks();
}
// print report status
if (arg[2] == "report") {
    getReport();
}
