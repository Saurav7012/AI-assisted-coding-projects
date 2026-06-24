const problem1 = {
    "title": "Add Two Numbers",
    "description": "Write a program that takes two integers as input and returns their sum.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCases": [
        {
            "input": "2 3",
            "output": "5",
            "explanation": "2 + 3 equals 5"
        },
        {
            "input": "-1 5",
            "output": "4",
            "explanation": "-1 + 5 equals 4"
        }
    ],
    "hiddenTestCases": [
        {
            "input": "10 20",
            "output": "30"
        },
        {
            "input": "100 250",
            "output": "350"
        }
    ],
    "startCode": [
        {
            "language": "C++",
            "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input here\n    cout << a + b;\n    return 0;\n}"
        },
        {
            "language": "Java",
            "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input here\n    }\n}"
        },
        {
            "language": "JavaScript",
            "initialCode": "const readline = require('readline');\n\n// Complete input handling here"
        }
    ],
    "referenceSolution": [
        {
            "language": "C++",
            "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}"
        },
        {
            "language": "Java",
            "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
        },
        {
            "language": "JavaScript",
            "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(a + b);"
        }
    ]
}

const problem2 = {
    "title": "Find Maximum of Two Numbers",
    "description": "Write a program that takes two integers as input and prints the larger number.",
    "difficulty": "easy",
    "tags": "array",
    "visibleTestCases": [
        {
            "input": "4 9",
            "output": "9",
            "explanation": "9 is greater than 4"
        },
        {
            "input": "15 2",
            "output": "15",
            "explanation": "15 is greater than 2"
        }
    ],
    "hiddenTestCases": [
        {
            "input": "-5 -2",
            "output": "-2"
        },
        {
            "input": "100 1000",
            "output": "1000"
        }
    ],
    "startCode": [
        {
            "language": "C++",
            "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    // Read input here\n    cout << max(a, b);\n    return 0;\n}"
        },
        {
            "language": "Java",
            "initialCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Read input here\n    }\n}"
        },
        {
            "language": "JavaScript",
            "initialCode": "const readline = require('readline');\n\n// Complete input handling here"
        }
    ],
    "referenceSolution": [
        {
            "language": "C++",
            "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << max(a, b);\n    return 0;\n}"
        },
        {
            "language": "Java",
            "completeCode": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(Math.max(a, b));\n    }\n}"
        },
        {
            "language": "JavaScript",
            "completeCode": "const input = require('fs').readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\nconsole.log(Math.max(a, b));"
        }
    ]
}

const finalData = {
        "source_code": "#include <iostream>\nusing namespace std;\nint main(){int a,b;cin>>a>>b;cout<<a+b;}",
        "language_id": 54,
        "stdin": "10 20",
        "expected_output": "30",
        "stdout": "30",
        "status_id": 3,
        "created_at": "2026-03-14T07:58:07.315Z",
        "finished_at": "2026-03-14T07:58:07.874Z",
        "time": "0.003",
        "memory": 1296,
        "stderr": null,
        "token": "59b891a2-c8bb-4894-9e5a-a7c9eb97bf3b",
        "number_of_runs": 1,
        "cpu_time_limit": "5.0",
        "cpu_extra_time": "1.0",
        "wall_time_limit": "10.0",
        "memory_limit": 256000,
        "stack_limit": 64000,
        "max_processes_and_or_threads": 128,
        "enable_per_process_and_thread_time_limit": false,
        "enable_per_process_and_thread_memory_limit": false,
        "max_file_size": 5120,
        "compile_output": null,
        "exit_code": 0,
        "exit_signal": null,
        "message": null,
        "wall_time": "0.019",
        "compiler_options": null,
        "command_line_arguments": null,
        "redirect_stderr_to_stdout": false,
        "callback_url": null,
        "additional_files": null,
        "enable_network": false,
        "post_execution_filesystem": "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",
        "status": {
            "id": 3,
            "description": "Accepted"
        },
        "language": {
            "id": 54,
            "name": "C++ (GCC 9.2.0)"
        }
    }



