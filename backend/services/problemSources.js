// =========================
// PROBLEM SOURCE ADAPTERS
// =========================


// =========================
// CODEFORCES
// =========================

async function fetchCodeforcesProblems() {
  try {
    const response = await fetch(
      "https://codeforces.com/api/problemset.problems"
    );

    if (!response.ok) {
      throw new Error(
        `Codeforces HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(
        data.comment || "Codeforces API failed"
      );
    }

    return (data.result.problems || [])
      .filter((problem) => problem.rating)
      .map((problem) => {
        const tags = problem.tags || [];
        const classification =
          classifyCodeforcesProblem(tags);

        return {
          platform: "Codeforces",
          problemId:
            `${problem.contestId}${problem.index}`,
          title: problem.name,
          difficulty:
            getCodeforcesDifficulty(
              problem.rating
            ),
          difficultyRank:
            getCodeforcesDifficultyRank(
              problem.rating
            ),
          rating: problem.rating,
          topics: tags,
          topic: classification.topic,
          subtopic: classification.subtopic,
          concepts: classification.concepts,
          oaSource: false,
          priority: 1,
          url:
            `https://codeforces.com/problemset/problem/` +
            `${problem.contestId}/${problem.index}`,
          reason:
            "Recommended from the Codeforces problemset based on topic and difficulty.",
        };
      });

  } catch (error) {
    console.error(
      "Codeforces source error:",
      error.message
    );

    return [];
  }
}


// =========================
// CODEFORCES DIFFICULTY
// =========================

function getCodeforcesDifficulty(rating) {
  if (rating <= 1000) {
    return "Easy";
  }

  if (rating <= 1600) {
    return "Medium";
  }

  return "Hard";
}

function getCodeforcesDifficultyRank(rating) {
  if (rating <= 1000) {
    return 1;
  }

  if (rating <= 1600) {
    return 2;
  }

  return 3;
}


// =========================
// CODEFORCES CLASSIFICATION
// =========================

function classifyCodeforcesProblem(tags) {
  const normalizedTags = tags.map((tag) =>
    tag.toLowerCase().trim()
  );

  const concepts = [];

  const addConcept = (name, tagList) => {
    if (
      normalizedTags.some((tag) =>
        tagList.includes(tag)
      )
    ) {
      concepts.push(name);
    }
  };

  addConcept("Arrays", [
    "arrays",
    "array",
  ]);

  addConcept("Two Pointers", [
    "two pointers",
  ]);

  addConcept("Sliding Window", [
    "sliding window",
  ]);

  addConcept("Prefix Sum", [
    "prefix sums",
  ]);

  addConcept("Sorting", [
    "sortings",
  ]);

  addConcept("Binary Search", [
    "binary search",
  ]);

  addConcept("Greedy", [
    "greedy",
  ]);

  addConcept("Backtracking", [
    "backtracking",
  ]);

  addConcept("Dynamic Programming", [
    "dp",
  ]);

  addConcept("Graphs", [
    "graphs",
    "graph matchings",
    "shortest paths",
    "dsu",
    "flows",
    "network flow",
    "topological sort",
  ]);

  addConcept("Trees", [
    "trees",
    "tree algorithms",
  ]);

  addConcept("BFS", [
    "bfs",
  ]);

  addConcept("DFS", [
    "dfs and similar",
  ]);

  addConcept("Data Structures", [
    "data structures",
    "segment tree",
    "fenwick tree",
    "sparse table",
    "queue",
    "stack",
    "heap",
    "priority queue",
  ]);

  addConcept("Strings", [
    "strings",
    "string algorithms",
    "string suffix structures",
    "suffix array",
    "suffix structures",
  ]);

  addConcept("Hashing", [
    "hashing",
  ]);

  addConcept("Math", [
    "math",
    "matrices",
  ]);

  addConcept("Number Theory", [
    "number theory",
    "prime numbers",
  ]);

  addConcept("Combinatorics", [
    "combinatorics",
  ]);

  addConcept("Bit Manipulation", [
    "bitmasks",
    "bitwise operations",
  ]);

  addConcept("Geometry", [
    "geometry",
  ]);

  addConcept("Divide and Conquer", [
    "divide and conquer",
  ]);

  addConcept("Game Theory", [
    "games",
  ]);


  let topic = "Other";

  let subtopic =
    tags.length > 0
      ? tags[0]
      : "Other";


  /*
    More specific techniques come first.

    Generic topics such as Arrays are
    deliberately placed later.
  */

  const priority = [
    ["Topological Sort", [
      "topological sort",
    ]],

    ["DSU", [
      "dsu",
    ]],

    ["Shortest Paths", [
      "shortest paths",
    ]],

    ["Network Flow", [
      "flows",
      "network flow",
    ]],

    ["Graph Matching", [
      "graph matchings",
    ]],

    ["BFS", [
      "bfs",
    ]],

    ["DFS", [
      "dfs and similar",
    ]],

    ["Dynamic Programming", [
      "dp",
    ]],

    ["Binary Search", [
      "binary search",
    ]],

    ["Two Pointers", [
      "two pointers",
    ]],

    ["Sliding Window", [
      "sliding window",
    ]],

    ["Prefix Sum", [
      "prefix sums",
    ]],

    ["Backtracking", [
      "backtracking",
    ]],

    ["Greedy", [
      "greedy",
    ]],

    ["Trees", [
      "trees",
      "tree algorithms",
    ]],

    ["Strings", [
      "strings",
      "string algorithms",
      "string suffix structures",
    ]],

    ["Hashing", [
      "hashing",
    ]],

    ["Sorting", [
      "sortings",
    ]],

    ["Bit Manipulation", [
      "bitmasks",
      "bitwise operations",
    ]],

    ["Number Theory", [
      "number theory",
    ]],

    ["Math", [
      "math",
      "matrices",
    ]],

    ["Arrays", [
      "arrays",
      "array",
    ]],
  ];


  for (
    const [group, groupTags]
    of priority
  ) {
    const found =
      normalizedTags.find((tag) =>
        groupTags.includes(tag)
      );

    if (found) {
      topic = group;
      subtopic = found;
      break;
    }
  }


  if (concepts.length === 0) {
    concepts.push(topic);
  }


  return {
    topic,
    subtopic,
    concepts,
  };
}


// =========================
// CSES
// =========================

async function fetchCSESProblems() {
  try {
    const response = await fetch(
      "https://cses.fi/problemset/list"
    );

    if (!response.ok) {
      throw new Error(
        `CSES HTTP error: ${response.status}`
      );
    }

    const html = await response.text();

    const problems = [];

    const sectionRegex =
      /<h2[^>]*>(.*?)<\/h2>/gi;

    const sections = [];

    let sectionMatch;

    while (
      (sectionMatch =
        sectionRegex.exec(html)) !== null
    ) {
      sections.push({
        name: cleanHtml(
          sectionMatch[1]
        ),
        start: sectionMatch.index,
      });
    }


    const problemRegex =
      /<a[^>]+href="\/problemset\/task\/(\d+)\/?"[^>]*>(.*?)<\/a>/gi;

    let problemMatch;

    while (
      (problemMatch =
        problemRegex.exec(html)) !== null
    ) {

      const problemId =
        problemMatch[1];

      const title =
        cleanHtml(
          problemMatch[2]
        );


      if (!title) {
        continue;
      }


      let currentSection =
        "General";


      for (
        const section of sections
      ) {
        if (
          section.start <
          problemMatch.index
        ) {
          currentSection =
            section.name;
        } else {
          break;
        }
      }


      const topic =
        normalizeCSESTopic(
          currentSection
        );


      const difficulty =
        getCSESDifficulty(
          currentSection
        );


      problems.push({
        platform: "CSES",
        problemId,
        title,
        difficulty,
        difficultyRank:
          getCSESDifficultyRank(
            difficulty
          ),
        rating: null,
        topics: [topic],
        topic,
        subtopic:
          currentSection,
        concepts: [topic],
        oaSource: false,
        priority: 1,
        url:
          `https://cses.fi/problemset/task/${problemId}`,
        reason:
          `Recommended from the CSES problemset under ${currentSection}.`,
      });
    }


    const uniqueProblems =
      Array.from(
        new Map(
          problems.map(
            (problem) => [
              problem.problemId,
              problem,
            ]
          )
        ).values()
      );


    console.log(
      `CSES problems fetched: ${uniqueProblems.length}`
    );


    return uniqueProblems;

  } catch (error) {

    console.error(
      "CSES source error:",
      error.message
    );

    return [];
  }
}


// =========================
// CSES HELPERS
// =========================

function normalizeCSESTopic(
  section
) {
  const value =
    section.toLowerCase();


  if (
    value.includes(
      "introductory"
    )
  ) {
    return "General";
  }


  if (
    value.includes(
      "sorting and searching"
    )
  ) {
    return "Sorting";
  }


  if (
    value.includes(
      "dynamic programming"
    )
  ) {
    return "Dynamic Programming";
  }


  if (
    value.includes(
      "graph algorithms"
    )
  ) {
    return "Graphs";
  }


  if (
    value.includes(
      "range queries"
    )
  ) {
    return "Range Queries";
  }


  if (
    value.includes(
      "tree algorithms"
    )
  ) {
    return "Trees";
  }


  if (
    value.includes(
      "mathematics"
    )
  ) {
    return "Math";
  }


  if (
    value.includes(
      "string algorithms"
    )
  ) {
    return "Strings";
  }


  if (
    value.includes(
      "geometry"
    )
  ) {
    return "Geometry";
  }


  return section;
}


function getCSESDifficulty(
  section
) {
  const value =
    section.toLowerCase();


  if (
    value.includes(
      "introductory"
    )
  ) {
    return "Easy";
  }


  if (
    value.includes(
      "advanced"
    ) ||
    value.includes(
      "counting"
    )
  ) {
    return "Hard";
  }


  return "Medium";
}


function getCSESDifficultyRank(
  difficulty
) {
  if (
    difficulty === "Easy"
  ) {
    return 1;
  }


  if (
    difficulty === "Medium"
  ) {
    return 2;
  }


  return 3;
}


// =========================
// LEETCODE
// =========================

async function fetchLeetCodeProblems() {
  try {

    const response = await fetch(
      "https://leetcode-api-pied.vercel.app/problems"
    );


    if (!response.ok) {
      throw new Error(
        `LeetCode HTTP error: ${response.status}`
      );
    }


    const data =
      await response.json();


    const rawProblems =
      Array.isArray(data)
        ? data
        : Array.isArray(
            data.problems
          )
        ? data.problems
        : Array.isArray(
            data.data
          )
        ? data.data
        : [];


    if (
      rawProblems.length === 0
    ) {
      throw new Error(
        "No LeetCode problems returned"
      );
    }


    const problems =
      rawProblems
        .filter(
          (problem) =>
            problem &&
            problem.frontend_id
        )
        .map(
          (problem) => {

            const topics =
              Array.isArray(
                problem.topic_tags
              )
                ? problem.topic_tags
                : [];


            const classification =
              classifyLeetCodeProblem(
                topics
              );


            const difficulty =
              normalizeLeetCodeDifficulty(
                problem.difficulty
              );


            return {

              platform:
                "LeetCode",

              problemId:
                String(
                  problem.frontend_id
                ),

              title:
                problem.title,

              difficulty,

              difficultyRank:
                getLeetCodeDifficultyRank(
                  difficulty
                ),

              rating: null,

              topics,

              topic:
                classification.topic,

              subtopic:
                classification.subtopic,

              concepts:
                classification.concepts,

              oaSource: false,

              priority: 1,

              url:
                problem.url ||
                `https://leetcode.com/problems/${problem.title_slug}/`,

              reason:
                "Recommended from the LeetCode problem database based on topic and difficulty.",
            };
          }
        );


    const uniqueProblems =
      Array.from(
        new Map(
          problems.map(
            (problem) => [
              problem.problemId,
              problem,
            ]
          )
        ).values()
      );


    console.log(
      `LeetCode problems fetched: ${uniqueProblems.length}`
    );


    return uniqueProblems;

  } catch (error) {

    console.error(
      "LeetCode source error:",
      error.message
    );

    return [];
  }
}


// =========================
// LEETCODE DIFFICULTY
// =========================

function normalizeLeetCodeDifficulty(
  difficulty
) {
  const value =
    String(
      difficulty || ""
    )
      .toLowerCase()
      .trim();


  if (
    value === "easy"
  ) {
    return "Easy";
  }


  if (
    value === "hard"
  ) {
    return "Hard";
  }


  return "Medium";
}


function getLeetCodeDifficultyRank(
  difficulty
) {
  if (
    difficulty === "Easy"
  ) {
    return 1;
  }


  if (
    difficulty === "Hard"
  ) {
    return 3;
  }


  return 2;
}


// =========================
// LEETCODE CLASSIFICATION
// =========================

function classifyLeetCodeProblem(
  topics
) {

  const tags =
    topics.map(
      (topic) => {

        if (
          typeof topic ===
          "string"
        ) {
          return topic
            .toLowerCase()
            .trim();
        }


        if (
          topic &&
          topic.name
        ) {
          return topic.name
            .toLowerCase()
            .trim();
        }


        return "";
      }
    );


  const concepts = [];


  const add = (
    name,
    values
  ) => {

    if (
      tags.some(
        (tag) =>
          values.includes(tag)
      )
    ) {
      concepts.push(name);
    }
  };


  // =========================
  // ALL CONCEPTS
  // =========================

  add("Arrays", [
    "array",
  ]);

  add("Hashing", [
    "hash table",
  ]);

  add("Strings", [
    "string",
  ]);

  add("Two Pointers", [
    "two pointers",
  ]);

  add("Sliding Window", [
    "sliding window",
  ]);

  add("Binary Search", [
    "binary search",
  ]);

  add("Sorting", [
    "sorting",
  ]);

  add("Greedy", [
    "greedy",
  ]);

  add("Backtracking", [
    "backtracking",
  ]);

  add("Dynamic Programming", [
    "dynamic programming",
  ]);

  add("Graphs", [
    "graph",
  ]);

  add("Topological Sort", [
    "topological sort",
  ]);

  add("Trees", [
    "tree",
    "binary tree",
  ]);

  add("BFS", [
    "breadth-first search",
  ]);

  add("DFS", [
    "depth-first search",
  ]);

  add("Heap", [
    "heap (priority queue)",
  ]);

  add("Stack", [
    "stack",
    "monotonic stack",
  ]);

  add("Linked List", [
    "linked list",
  ]);

  add("Trie", [
    "trie",
  ]);

  add("Union Find", [
    "union find",
  ]);

  add("Bit Manipulation", [
    "bit manipulation",
  ]);

  add("Math", [
    "math",
  ]);

  add("Number Theory", [
    "number theory",
  ]);

  add("Matrix", [
    "matrix",
  ]);

  add("Intervals", [
    "interval",
  ]);


  // =========================
  // PRIMARY TOPIC
  // =========================

  let topic = "Other";

  let subtopic = "Other";


  /*
    IMPORTANT:

    Specific DSA techniques are
    checked BEFORE generic Array.

    This prevents problems such as:

    Alien Dictionary
      Graph + Topological Sort
      -> Graphs

    Accounts Merge
      Union Find
      -> Union Find

    Next Greater Element
      Stack + Array
      -> Stack

    instead of automatically
    becoming Arrays.
  */

  const priority = [

    [
      "Topological Sort",
      [
        "topological sort",
      ],
    ],

    [
      "Union Find",
      [
        "union find",
      ],
    ],

    [
      "BFS",
      [
        "breadth-first search",
      ],
    ],

    [
      "DFS",
      [
        "depth-first search",
      ],
    ],

    [
      "Stack",
      [
        "stack",
        "monotonic stack",
      ],
    ],

    [
      "Heap",
      [
        "heap (priority queue)",
      ],
    ],

    [
      "Trie",
      [
        "trie",
      ],
    ],

    [
      "Linked List",
      [
        "linked list",
      ],
    ],

    [
      "Dynamic Programming",
      [
        "dynamic programming",
      ],
    ],

    [
      "Binary Search",
      [
        "binary search",
      ],
    ],

    [
      "Sliding Window",
      [
        "sliding window",
      ],
    ],

    [
      "Two Pointers",
      [
        "two pointers",
      ],
    ],

    [
      "Backtracking",
      [
        "backtracking",
      ],
    ],

    [
      "Greedy",
      [
        "greedy",
      ],
    ],

    [
      "Graphs",
      [
        "graph",
      ],
    ],

    [
      "Trees",
      [
        "tree",
        "binary tree",
      ],
    ],

    [
      "Intervals",
      [
        "interval",
      ],
    ],

    [
      "Sorting",
      [
        "sorting",
      ],
    ],

    [
      "Hashing",
      [
        "hash table",
      ],
    ],

    [
      "Bit Manipulation",
      [
        "bit manipulation",
      ],
    ],

    [
      "Matrix",
      [
        "matrix",
      ],
    ],

    [
      "Strings",
      [
        "string",
      ],
    ],

    [
      "Math",
      [
        "math",
      ],
    ],

    /*
      Array is intentionally near the end.
    */

    [
      "Arrays",
      [
        "array",
      ],
    ],
  ];


  for (
    const [
      group,
      values,
    ] of priority
  ) {

    const match =
      tags.find(
        (tag) =>
          values.includes(tag)
      );


    if (match) {

      topic = group;

      subtopic = match;

      break;
    }
  }


  if (
    concepts.length === 0
  ) {
    concepts.push(topic);
  }


  return {
    topic,
    subtopic,
    concepts,
  };
}


// =========================
// HTML CLEANING
// =========================

function cleanHtml(text) {
  return text
    .replace(
      /<[^>]*>/g,
      ""
    )
    .replace(
      /&amp;/g,
      "&"
    )
    .replace(
      /&#39;/g,
      "'"
    )
    .replace(
      /&quot;/g,
      '"'
    )
    .replace(
      /&lt;/g,
      "<"
    )
    .replace(
      /&gt;/g,
      ">"
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}


// =========================
// ALL SOURCES
// =========================

async function fetchAllProblemSources() {

  const [
    codeforcesProblems,
    csesProblems,
    leetcodeProblems,
  ] = await Promise.all([

    fetchCodeforcesProblems(),

    fetchCSESProblems(),

    fetchLeetCodeProblems(),

  ]);


  return {

    codeforces:
      codeforcesProblems,

    cses:
      csesProblems,

    leetcode:
      leetcodeProblems,

    // Intentionally unused.
    gfg: [],

    oaGuide: [],

  };
}


// =========================
// EXPORTS
// =========================

module.exports = {
  fetchCodeforcesProblems,
  fetchCSESProblems,
  fetchLeetCodeProblems,
  fetchAllProblemSources,
};