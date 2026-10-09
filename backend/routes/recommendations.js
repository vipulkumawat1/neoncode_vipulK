const express = require("express");
const Review = require("../models/Review.js");
const authenticateToken = require("../middleware/auth.js");

const router = express.Router();


// =====================================================
// NORMALIZATION
// =====================================================

function normalizeText(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .toLowerCase()
    .replace(/dynamic programming/g, "dp")
    .replace(/hash table/g, "hashing")
    .replace(/hash map/g, "hashing")
    .replace(/hash maps/g, "hashing")
    .replace(/two pointer/g, "two pointers")
    .replace(/binary search/g, "binary search")
    .replace(/prefix sums/g, "prefix sum")
    .replace(/linear searching/g, "linear search")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


// =====================================================
// GENERIC TOPICS
// =====================================================

const genericTopics = [
  "basic io",
  "io",
  "input output",
  "implementation",
  "basic implementation",
  "general",
  "misc",
  "miscellaneous",
  "programming basics",
  "unknown",
];

function isGenericTopic(topic) {
  const normalized = normalizeText(topic);

  return (
    !normalized ||
    genericTopics.includes(normalized)
  );
}


// =====================================================
// CANONICAL TOPICS
// =====================================================

function canonicalTopic(topic) {
  const normalized = normalizeText(topic);

  const aliases = {
    array: "arrays",
    arrays: "arrays",

    hash: "hashing",
    hashmap: "hashing",
    "hash map": "hashing",
    hashing: "hashing",

    string: "strings",
    strings: "strings",

    graph: "graphs",
    graphs: "graphs",

    tree: "trees",
    trees: "trees",

    linkedlist: "linked list",
    "linked list": "linked list",

    dp: "dp",
    "dynamic programming": "dp",

    sorting: "sorting",
    sort: "sorting",

    "two pointer": "two pointers",
    "two pointers": "two pointers",

    "sliding window": "sliding window",
    "sliding windows": "sliding window",

    stack: "stack",
    stacks: "stack",

    queue: "queue",
    queues: "queue",

    heap: "heap",
    heaps: "heap",

    "priority queue": "heap",

    recursion: "recursion",
    recursive: "recursion",

    backtracking: "backtracking",

    "binary search": "binary search",

    "prefix sum": "prefix sum",

    greedy: "greedy",

    math: "math",

    trie: "trie",

    dsu: "dsu",

    "union find": "dsu",

    "linear search": "linear search",
    "linear searching": "linear search",
    searching: "linear search",
  };

  return aliases[normalized] || normalized;
}


// =====================================================
// CODE PATTERN DETECTION
// =====================================================

function detectPatterns(code, review) {
  const patterns = [];

  const source = String(
    code || ""
  ).toLowerCase();

  const reviewText = [
    review?.topic || "",
    review?.summary || "",
    ...(review?.suggestions || []),
    ...(review?.bugs || []),
    ...(review?.strengths || []),
  ]
    .join(" ")
    .toLowerCase();


  function addPattern(pattern) {
    if (!patterns.includes(pattern)) {
      patterns.push(pattern);
    }
  }


  // ===================================================
  // TWO SUM
  // ===================================================

  if (
    source.includes("two sum") ||
    source.includes("twosum") ||
    (
      source.includes("target") &&
      (
        source.includes("nums[i]") ||
        source.includes("arr[i]") ||
        source.includes("a[i]")
      ) &&
      (
        source.includes("unordered_map") ||
        source.includes("unordered_set") ||
        source.includes("map<") ||
        source.includes("set<")
      )
    ) ||
    reviewText.includes("two sum") ||
    reviewText.includes("pair sum")
  ) {
    addPattern("two sum");
    addPattern("hashing");
    addPattern("arrays");
  }


  // ===================================================
  // HASHING
  // ===================================================

  if (
    source.includes("unordered_map") ||
    source.includes("unordered_set") ||
    source.includes("hashmap") ||
    source.includes("hash map") ||
    reviewText.includes("hash map") ||
    reviewText.includes("hashing") ||
    reviewText.includes("frequency map")
  ) {
    addPattern("hashing");
  }


  // ===================================================
  // LINEAR SEARCH
  // ===================================================

  const hasSimpleForwardLoop =
    (
      source.includes("i < n") ||
      source.includes("i<n") ||
      source.includes("i <= n")
    ) &&
    (
      source.includes("i++") ||
      source.includes("++i")
    );

  const hasElementComparison =
    source.includes("a[i] ==") ||
    source.includes("a[i]==") ||
    source.includes("arr[i] ==") ||
    source.includes("arr[i]==") ||
    source.includes("nums[i] ==") ||
    source.includes("nums[i]==");

  const hasTargetSearch =
    source.includes("target") ||
    source.includes("key") ||
    source.includes("element") ||
    source.includes("search");

  const hasIndexOutput =
    source.includes("cout << i") ||
    source.includes("cout<<i") ||
    source.includes("return i") ||
    source.includes("return -1");

  if (
    (
      hasSimpleForwardLoop &&
      hasElementComparison &&
      hasTargetSearch
    ) ||
    (
      hasSimpleForwardLoop &&
      hasElementComparison &&
      hasIndexOutput
    ) ||
    reviewText.includes("linear search") ||
    reviewText.includes("linear searching")
  ) {
    addPattern("linear search");
  }


  // ===================================================
  // ARRAYS
  // ===================================================

  if (
    source.includes("vector<") ||
    source.includes("vector ") ||
    source.includes("array") ||
    reviewText.includes("array")
  ) {
    addPattern("arrays");
  }


  // ===================================================
  // SORTING
  // ===================================================

  if (
    source.includes("sort(") ||
    source.includes("sort (") ||
    source.includes("stable_sort") ||
    reviewText.includes("sorting")
  ) {
    addPattern("sorting");
  }


  // ===================================================
  // BINARY SEARCH
  // ===================================================

  if (
    source.includes("lower_bound") ||
    source.includes("upper_bound") ||
    source.includes("binary_search") ||
    reviewText.includes("binary search")
  ) {
    addPattern("binary search");
  }


  // ===================================================
  // TWO POINTERS
  // ===================================================

  if (
    (
      source.includes("left++") &&
      source.includes("right--")
    ) ||
    (
      source.includes("l++") &&
      source.includes("r--")
    ) ||
    reviewText.includes("two pointer")
  ) {
    addPattern("two pointers");
  }


  // ===================================================
  // SLIDING WINDOW
  // ===================================================

  if (
    reviewText.includes("sliding window") ||
    source.includes("sliding window") ||
    source.includes("window")
  ) {
    addPattern("sliding window");
  }

  const hasArrayLikeData =
    source.includes("vector<") ||
    source.includes("vector ") ||
    source.includes("array");

  const hasWindowSize =
    /\bint\s+k\b/.test(source) ||
    /\bsize_t\s+k\b/.test(source);

  const hasFixedWindowBounds =
    (
      source.includes("n - k") ||
      source.includes("n-k") ||
      source.includes("i + k") ||
      source.includes("i+k")
    ) &&
    (
      source.includes("j = i") ||
      source.includes("j=i")
    ) &&
    (
      source.includes("j < i + k") ||
      source.includes("j<i+k") ||
      source.includes("j < i+k")
    );

  const hasAggregateOperation =
    source.includes("sum") ||
    source.includes("count") ||
    source.includes("max") ||
    source.includes("min");

  if (
    hasArrayLikeData &&
    hasWindowSize &&
    hasFixedWindowBounds &&
    hasAggregateOperation
  ) {
    addPattern("sliding window");
  }


  // ===================================================
  // STACK
  // ===================================================

  if (
    source.includes("stack<") ||
    reviewText.includes("stack")
  ) {
    addPattern("stack");
  }


  // ===================================================
  // BFS
  // ===================================================

  if (
    source.includes("queue<") ||
    reviewText.includes("bfs") ||
    reviewText.includes("breadth first")
  ) {
    addPattern("bfs");
  }


  // ===================================================
  // DFS
  // ===================================================

  if (
    reviewText.includes("dfs") ||
    reviewText.includes("depth first") ||
    source.includes("dfs(")
  ) {
    addPattern("dfs");
  }


  // ===================================================
  // HEAP
  // ===================================================

  if (
    source.includes("priority_queue") ||
    reviewText.includes("priority queue") ||
    reviewText.includes("heap")
  ) {
    addPattern("heap");
  }


  // ===================================================
  // DP
  // ===================================================

  if (
    source.includes("dp[") ||
    source.includes("memo") ||
    reviewText.includes("dynamic programming") ||
    reviewText.includes("dp")
  ) {
    addPattern("dp");
  }


  // ===================================================
  // RECURSION
  // ===================================================

  if (
    reviewText.includes("recursion") ||
    reviewText.includes("recursive")
  ) {
    addPattern("recursion");
  }


  // ===================================================
  // BACKTRACKING
  // ===================================================

  if (
    reviewText.includes("backtracking") ||
    source.includes("backtrack")
  ) {
    addPattern("backtracking");
  }


  // ===================================================
  // LINKED LIST
  // ===================================================

  if (
    source.includes("listnode") ||
    source.includes("node*") ||
    reviewText.includes("linked list")
  ) {
    addPattern("linked list");
  }


  // ===================================================
  // GREEDY
  // ===================================================

  if (
    reviewText.includes("greedy")
  ) {
    addPattern("greedy");
  }


  // ===================================================
  // PREFIX SUM
  // ===================================================

  if (
    reviewText.includes("prefix sum") ||
    reviewText.includes("prefix sums")
  ) {
    addPattern("prefix sum");
  }


  return patterns;
}


// =====================================================
// PROBLEM TOPICS
// =====================================================

function getProblemTopics(problem) {
  const values = [];

  if (problem.topic) {
    values.push(problem.topic);
  }

  if (problem.subtopic) {
    values.push(problem.subtopic);
  }

  if (Array.isArray(problem.topics)) {
    values.push(
      ...problem.topics
    );
  }

  if (Array.isArray(problem.concepts)) {
    values.push(
      ...problem.concepts
    );
  }

  return values
    .map(canonicalTopic)
    .filter(Boolean);
}


// =====================================================
// PROBLEM TEXT
// =====================================================

function getProblemText(problem) {
  return [
    problem.title || "",
    problem.topic || "",
    problem.subtopic || "",
    ...(Array.isArray(problem.topics)
      ? problem.topics
      : []),
    ...(Array.isArray(problem.concepts)
      ? problem.concepts
      : []),
  ]
    .join(" ")
    .toLowerCase();
}


// =====================================================
// PATTERN SCORE
// =====================================================

function getPatternScore(problem, patterns) {
  if (!patterns.length) {
    return 0;
  }

  const topics =
    getProblemTopics(problem);

  const text =
    getProblemText(problem);

  const title =
    String(
      problem.title || ""
    ).toLowerCase();

  let bestScore = 0;


  for (const pattern of patterns) {

    // -------------------------------------------------
    // TWO SUM
    // -------------------------------------------------

    if (pattern === "two sum") {

      if (
        title.includes("two sum") ||
        title.includes("pair sum") ||
        text.includes("two sum") ||
        text.includes("pair sum")
      ) {
        bestScore =
          Math.max(
            bestScore,
            160
          );
      }
    }


    // -------------------------------------------------
    // LINEAR SEARCH
    // -------------------------------------------------

    if (pattern === "linear search") {

      if (
        topics.includes("linear search")
      ) {
        bestScore =
          Math.max(
            bestScore,
            145
          );
      }

      if (
        title.includes("linear search") ||
        title.includes("search element") ||
        title.includes("find element") ||
        title.includes("find the element") ||
        title.includes("searching")
      ) {
        bestScore =
          Math.max(
            bestScore,
            135
          );
      }

      if (
        text.includes("linear search") ||
        text.includes("linear searching")
      ) {
        bestScore =
          Math.max(
            bestScore,
            130
          );
      }

      /*
        These are useful search/array matches but weaker
        than a problem explicitly labelled Linear Search.
      */
      if (
        title.includes("find") ||
        title.includes("search")
      ) {
        bestScore =
          Math.max(
            bestScore,
            90
          );
      }
    }


    // -------------------------------------------------
    // HASHING
    // -------------------------------------------------

    if (pattern === "hashing") {

      if (
        topics.includes("hashing")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("hash") ||
        text.includes("frequency") ||
        text.includes("duplicate") ||
        text.includes("lookup")
      ) {
        bestScore =
          Math.max(
            bestScore,
            95
          );
      }
    }


    // -------------------------------------------------
    // SLIDING WINDOW
    // -------------------------------------------------

    if (
      pattern === "sliding window"
    ) {

      if (
        topics.includes("sliding window")
      ) {
        bestScore =
          Math.max(
            bestScore,
            140
          );
      }

      if (
        text.includes("sliding window")
      ) {
        bestScore =
          Math.max(
            bestScore,
            135
          );
      }

      if (
        text.includes("fixed window") ||
        text.includes("variable window") ||
        text.includes("window size")
      ) {
        bestScore =
          Math.max(
            bestScore,
            110
          );
      }

      if (
        title.includes("subarray") ||
        title.includes("substring") ||
        title.includes("contiguous") ||
        text.includes("subarray") ||
        text.includes("substring") ||
        text.includes("contiguous")
      ) {
        bestScore =
          Math.max(
            bestScore,
            72
          );
      }
    }


    // -------------------------------------------------
    // TWO POINTERS
    // -------------------------------------------------

    if (
      pattern === "two pointers"
    ) {

      if (
        topics.includes("two pointers")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("two pointers") ||
        text.includes("two pointer")
      ) {
        bestScore =
          Math.max(
            bestScore,
            110
          );
      }
    }


    // -------------------------------------------------
    // BINARY SEARCH
    // -------------------------------------------------

    if (
      pattern === "binary search"
    ) {

      if (
        topics.includes("binary search")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("binary search")
      ) {
        bestScore =
          Math.max(
            bestScore,
            110
          );
      }
    }


    // -------------------------------------------------
    // SORTING
    // -------------------------------------------------

    if (
      pattern === "sorting"
    ) {

      if (
        topics.includes("sorting")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("sorting")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // STACK
    // -------------------------------------------------

    if (
      pattern === "stack"
    ) {

      if (
        topics.includes("stack")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("stack")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // BFS
    // -------------------------------------------------

    if (
      pattern === "bfs"
    ) {

      if (
        topics.includes("bfs") ||
        topics.includes("breadth first search")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("bfs") ||
        text.includes("breadth first")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // DFS
    // -------------------------------------------------

    if (
      pattern === "dfs"
    ) {

      if (
        topics.includes("dfs")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("dfs") ||
        text.includes("depth first")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // HEAP
    // -------------------------------------------------

    if (
      pattern === "heap"
    ) {

      if (
        topics.includes("heap")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("heap") ||
        text.includes("priority queue")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // DP
    // -------------------------------------------------

    if (
      pattern === "dp"
    ) {

      if (
        topics.includes("dp")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("dynamic programming") ||
        text.includes("dp")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // RECURSION
    // -------------------------------------------------

    if (
      pattern === "recursion"
    ) {

      if (
        topics.includes("recursion")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("recursion") ||
        text.includes("recursive")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // BACKTRACKING
    // -------------------------------------------------

    if (
      pattern === "backtracking"
    ) {

      if (
        topics.includes("backtracking")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("backtracking")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // LINKED LIST
    // -------------------------------------------------

    if (
      pattern === "linked list"
    ) {

      if (
        topics.includes("linked list")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("linked list")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // GREEDY
    // -------------------------------------------------

    if (
      pattern === "greedy"
    ) {

      if (
        topics.includes("greedy")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("greedy")
      ) {
        bestScore =
          Math.max(
            bestScore,
            105
          );
      }
    }


    // -------------------------------------------------
    // PREFIX SUM
    // -------------------------------------------------

    if (
      pattern === "prefix sum"
    ) {

      if (
        topics.includes("prefix sum")
      ) {
        bestScore =
          Math.max(
            bestScore,
            120
          );
      }

      if (
        text.includes("prefix sum") ||
        text.includes("prefix sums")
      ) {
        bestScore =
          Math.max(
            bestScore,
            110
          );
      }
    }


    // -------------------------------------------------
    // ARRAYS
    // -------------------------------------------------

    /*
      Arrays are only a supporting topic.

      This prevents:
      Arrays -> random array problem

      from overpowering:
      Linear Search -> actual searching problem
      Sliding Window -> actual window problem
      Hashing -> actual hashing problem
    */

    if (
      pattern === "arrays" &&
      topics.includes("arrays")
    ) {
      bestScore =
        Math.max(
          bestScore,
          40
        );
    }
  }


  return bestScore;
}


// =====================================================
// SOURCE BONUS
// =====================================================

function getSourceBonus(problem) {

  /*
    All three platforms are equally valid.

    We do NOT give LeetCode a larger bonus.
  */

  if (
    problem.platform === "LeetCode" ||
    problem.platform === "Codeforces" ||
    problem.platform === "CSES"
  ) {
    return 3;
  }

  return 0;
}


// =====================================================
// RECOMMENDATION SCORE
// =====================================================

function getRecommendationScore(
  problem,
  patternScore
) {
  return (
    patternScore +
    getSourceBonus(problem) +
    (Number(problem.priority) || 1) * 2
  );
}


// =====================================================
// SORT
// =====================================================

function sortCandidates(problems) {
  return [...problems].sort(
    (a, b) => {

      if (
        b.recommendationScore !==
        a.recommendationScore
      ) {
        return (
          b.recommendationScore -
          a.recommendationScore
        );
      }

      /*
        If both have ratings, prefer the lower rating
        when recommendation relevance is equal.
      */

      if (
        a.rating != null &&
        b.rating != null
      ) {
        return (
          Number(a.rating) -
          Number(b.rating)
        );
      }

      return String(
        a.title || ""
      ).localeCompare(
        String(
          b.title || ""
        )
      );
    }
  );
}


// =====================================================
// REMOVE DUPLICATES
// =====================================================

function removeDuplicates(problems) {
  const map = new Map();

  for (
    const problem of problems
  ) {

    const key =
      `${problem.platform}-${
        problem.problemId ||
        problem.title
      }`;

    if (!map.has(key)) {
      map.set(
        key,
        problem
      );
    }
  }

  return Array.from(
    map.values()
  );
}


// =====================================================
// PLATFORM DIVERSITY SELECTION
// =====================================================

function selectFromSources(
  problems,
  count
) {
  if (
    !problems.length ||
    count <= 0
  ) {
    return [];
  }

  const sorted =
    sortCandidates(
      problems
    );

  const selected = [];

  const usedPlatforms =
    new Set();


  /*
    IMPORTANT:

    We do NOT force one problem from every platform.

    Instead:

    1. Pick the strongest problem first.
    2. Look for another platform if its relevance
       is reasonably close.
    3. Never replace a highly relevant problem with
       an unrelated one just for diversity.
  */

  const bestScore =
    sorted[0]?.recommendationScore || 0;

  const diversityWindow = 30;


  // ---------------------------------------------------
  // FIRST: strongest candidate
  // ---------------------------------------------------

  selected.push(
    sorted[0]
  );

  usedPlatforms.add(
    sorted[0].platform
  );


  // ---------------------------------------------------
  // SECOND: relevant different platforms
  // ---------------------------------------------------

  for (
    const problem of sorted
  ) {

    if (
      selected.length >= count
    ) {
      break;
    }

    if (
      usedPlatforms.has(
        problem.platform
      )
    ) {
      continue;
    }

    const score =
      problem.recommendationScore || 0;

    /*
      A different platform is allowed when it is
      still reasonably relevant.
    */

    if (
      score >=
      bestScore - diversityWindow
    ) {
      selected.push(
        problem
      );

      usedPlatforms.add(
        problem.platform
      );
    }
  }


  // ---------------------------------------------------
  // THIRD: fill remaining by pure relevance
  // ---------------------------------------------------

  for (
    const problem of sorted
  ) {

    if (
      selected.length >= count
    ) {
      break;
    }

    const key =
      `${problem.platform}-${
        problem.problemId ||
        problem.title
      }`;

    const exists =
      selected.some(
        (item) =>
          `${item.platform}-${
            item.problemId ||
            item.title
          }` === key
      );

    if (!exists) {
      selected.push(
        problem
      );
    }
  }


  return selected;
}


// =====================================================
// BUILD 3 EASY / 4 MEDIUM / 3 HARD
// =====================================================

function buildRecommendations(
  problems
) {

  const easy =
    problems.filter(
      (problem) =>
        Number(
          problem.difficultyRank
        ) === 1
    );

  const medium =
    problems.filter(
      (problem) =>
        Number(
          problem.difficultyRank
        ) === 2
    );

  const hard =
    problems.filter(
      (problem) =>
        Number(
          problem.difficultyRank
        ) === 3
    );


  const easySelected =
    selectFromSources(
      easy,
      3
    );

  const mediumSelected =
    selectFromSources(
      medium,
      4
    );

  const hardSelected =
    selectFromSources(
      hard,
      3
    );


  return [
    ...easySelected,
    ...mediumSelected,
    ...hardSelected,
  ];
}


// =====================================================
// REASON
// =====================================================

function createReason(
  problem,
  patterns
) {

  const text =
    getProblemText(
      problem
    );


  if (
    patterns.includes(
      "two sum"
    ) &&
    (
      text.includes("two sum") ||
      text.includes("pair sum")
    )
  ) {
    return (
      "Recommended because it directly practices the Two Sum / pair-sum pattern."
    );
  }


  if (
    patterns.includes(
      "linear search"
    ) &&
    (
      text.includes("linear search") ||
      text.includes("search element") ||
      text.includes("find element") ||
      text.includes("searching") ||
      text.includes("search")
    )
  ) {
    return (
      "Recommended because it practices linear search and element-finding techniques."
    );
  }


  if (
    patterns.includes(
      "hashing"
    ) &&
    (
      text.includes("hash") ||
      text.includes("frequency") ||
      text.includes("duplicate") ||
      text.includes("lookup")
    )
  ) {
    return (
      "Recommended because it practices hashing and fast lookup techniques."
    );
  }


  if (
    patterns.includes(
      "sliding window"
    ) &&
    (
      text.includes("sliding window") ||
      text.includes("window") ||
      text.includes("subarray") ||
      text.includes("substring") ||
      text.includes("contiguous")
    )
  ) {
    return (
      "Recommended because it practices sliding-window and contiguous-range techniques."
    );
  }


  if (
    patterns.includes(
      "binary search"
    ) &&
    (
      text.includes("binary search")
    )
  ) {
    return (
      "Recommended because it practices binary-search techniques."
    );
  }


  if (
    patterns.includes(
      "two pointers"
    ) &&
    (
      text.includes("two pointer")
    )
  ) {
    return (
      "Recommended because it practices the two-pointers technique."
    );
  }


  const primaryPattern =
    patterns[0] ||
    "DSA";


  return (
    `Recommended because it practices the ${primaryPattern} pattern.`
  );
}


// =====================================================
// API
// =====================================================

router.get(
  "/",
  authenticateToken,
  async (req, res) => {

    try {

      // =================================================
      // LOAD SOURCE ADAPTER
      // =================================================

      const sourcePath =
        require.resolve(
          "../services/problemSources.js"
        );

      delete require.cache[
        sourcePath
      ];

      const {
        fetchAllProblemSources,
      } = require(
        "../services/problemSources.js"
      );


      // =================================================
      // GET USER REVIEWS
      // =================================================

      const reviews =
        await Review.find({
          user: req.userId,
        })
          .sort({
            createdAt: -1,
          })
          .select(
            "topic score code language suggestions bugs strengths summary createdAt"
          );


      if (
        reviews.length === 0
      ) {

        return res.json({
          success: true,
          weakestTopic: null,
          targetPatterns: [],
          recommendations: [],
          message:
            "Submit some code reviews first so NEONCODE can identify your problem-solving patterns.",
        });
      }


      // =================================================
      // CALCULATE TOPIC HISTORY
      // =================================================

      const topicData = {};


      reviews.forEach(
        (review) => {

          if (!review.topic) {
            return;
          }

          const topic =
            canonicalTopic(
              review.topic
            );

          if (!topic) {
            return;
          }

          if (!topicData[topic]) {

            topicData[topic] = {
              name:
                review.topic,

              totalScore: 0,

              count: 0,
            };
          }

          topicData[
            topic
          ].totalScore +=
            Number(
              review.score
            ) || 0;

          topicData[
            topic
          ].count++;
        }
      );


      const topics =
        Object.values(
          topicData
        ).map(
          (data) => ({
            name:
              data.name,

            score:
              data.totalScore /
              data.count,

            reviews:
              data.count,
          })
        );


      const weakestTopic =
        topics.length > 0
          ? topics.reduce(
              (
                weakest,
                topic
              ) =>
                topic.score <
                weakest.score
                  ? topic
                  : weakest
            )
          : null;


      // =================================================
      // LATEST REVIEW
      // =================================================

      const latestReview =
        reviews[0];


      // =================================================
      // DETECT CURRENT PATTERNS
      // =================================================

      const detectedPatterns =
        detectPatterns(
          latestReview.code,
          latestReview
        );


      // =================================================
      // TARGET PATTERNS
      // =================================================

      let targetPatterns =
        [...detectedPatterns];


      /*
        Add AI topic only when it is useful.

        Generic topics such as:
        Basic I/O
        Implementation
        General

        are ignored.
      */

      if (
        latestReview.topic &&
        !isGenericTopic(
          latestReview.topic
        )
      ) {

        const topic =
          canonicalTopic(
            latestReview.topic
          );

        if (
          topic &&
          !targetPatterns.includes(
            topic
          )
        ) {
          targetPatterns.push(
            topic
          );
        }
      }


      console.log(
        "======================================"
      );

      console.log(
        "LATEST REVIEW"
      );

      console.log(
        "AI topic:",
        latestReview.topic
      );

      console.log(
        "Detected patterns:",
        detectedPatterns
      );

      console.log(
        "Target patterns:",
        targetPatterns
      );


      // =================================================
      // FETCH ALL REAL SOURCES
      // =================================================

      const sources =
        await fetchAllProblemSources();


      const leetcode =
        sources.leetcode || [];

      const codeforces =
        sources.codeforces || [];

      const cses =
        sources.cses || [];


      console.log(
        "SOURCE COUNTS:",
        {
          leetcode:
            leetcode.length,

          codeforces:
            codeforces.length,

          cses:
            cses.length,
        }
      );


      // =================================================
      // COMBINE ONLY SELECTED PLATFORMS
      // =================================================

      const allProblems = [
        ...leetcode,
        ...codeforces,
        ...cses,
      ];


      // =================================================
      // SCORE ALL PROBLEMS
      // =================================================

      let matchingProblems =
        allProblems
          .map(
            (problem) => {

              const patternScore =
                getPatternScore(
                  problem,
                  targetPatterns
                );


              /*
                Zero means completely unrelated.
              */

              if (
                patternScore <= 0
              ) {
                return null;
              }


              return {
                ...problem,

                topicMatchScore:
                  patternScore,

                recommendationScore:
                  getRecommendationScore(
                    problem,
                    patternScore
                  ),

                isFallback:
                  false,

                reason:
                  createReason(
                    problem,
                    targetPatterns
                  ),
              };
            }
          )
          .filter(Boolean);


      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      matchingProblems =
        removeDuplicates(
          matchingProblems
        );


      // =================================================
      // KEEP STRONG MATCHES
      // =================================================

      const hasSpecificPattern =
        targetPatterns.some(
          (pattern) =>
            pattern !== "arrays"
        );


      if (
        hasSpecificPattern
      ) {

        const strongMatches =
          matchingProblems.filter(
            (problem) =>
              problem.topicMatchScore >= 70
          );


        /*
          If we have strong matches, remove generic
          array-only matches.

          This prevents things like:

          Linear Search
          ->
          random matrix problem

          from appearing just because both use arrays.
        */

        if (
          strongMatches.length > 0
        ) {
          matchingProblems =
            strongMatches;
        }
      }


      console.log(
        "RELEVANT PROBLEMS:",
        matchingProblems.length
      );


      // =================================================
      // PLATFORM DISTRIBUTION BEFORE SELECTION
      // =================================================

      console.log(
        "RELEVANT BY PLATFORM:",
        {
          leetcode:
            matchingProblems.filter(
              (p) =>
                p.platform ===
                "LeetCode"
            ).length,

          codeforces:
            matchingProblems.filter(
              (p) =>
                p.platform ===
                "Codeforces"
            ).length,

          cses:
            matchingProblems.filter(
              (p) =>
                p.platform ===
                "CSES"
            ).length,
        }
      );


      // =================================================
      // DIFFICULTY DISTRIBUTION
      // =================================================

      console.log(
        "RELEVANT BY DIFFICULTY:",
        {
          easy:
            matchingProblems.filter(
              (p) =>
                Number(
                  p.difficultyRank
                ) === 1
            ).length,

          medium:
            matchingProblems.filter(
              (p) =>
                Number(
                  p.difficultyRank
                ) === 2
            ).length,

          hard:
            matchingProblems.filter(
              (p) =>
                Number(
                  p.difficultyRank
                ) === 3
            ).length,
        }
      );


      // =================================================
      // BUILD EXACT 3 / 4 / 3
      // =================================================

      let recommendations =
        buildRecommendations(
          matchingProblems
        );


      // =================================================
      // FINAL DIFFICULTY SAFETY
      // =================================================

      const finalEasy =
        recommendations
          .filter(
            (problem) =>
              Number(
                problem.difficultyRank
              ) === 1
          )
          .slice(
            0,
            3
          );


      const finalMedium =
        recommendations
          .filter(
            (problem) =>
              Number(
                problem.difficultyRank
              ) === 2
          )
          .slice(
            0,
            4
          );


      const finalHard =
        recommendations
          .filter(
            (problem) =>
              Number(
                problem.difficultyRank
              ) === 3
          )
          .slice(
            0,
            3
          );


      recommendations = [
        ...finalEasy,
        ...finalMedium,
        ...finalHard,
      ];


      // =================================================
      // FINAL LOG
      // =================================================

      console.log(
        "FINAL RECOMMENDATIONS:",
        recommendations.length
      );

      console.log(
        "FINAL PLATFORM DISTRIBUTION:",
        {
          leetcode:
            recommendations.filter(
              (p) =>
                p.platform ===
                "LeetCode"
            ).length,

          codeforces:
            recommendations.filter(
              (p) =>
                p.platform ===
                "Codeforces"
            ).length,

          cses:
            recommendations.filter(
              (p) =>
                p.platform ===
                "CSES"
            ).length,
        }
      );

      console.log(
        "FINAL DIFFICULTY DISTRIBUTION:",
        {
          easy:
            finalEasy.length,

          medium:
            finalMedium.length,

          hard:
            finalHard.length,
        }
      );

      console.log(
        "======================================"
      );


      // =================================================
      // RESPONSE
      // =================================================

      res.json({

        success: true,

        weakestTopic:
          weakestTopic
            ? {
                name:
                  weakestTopic.name,

                score:
                  Number(
                    weakestTopic.score.toFixed(
                      1
                    )
                  ),

                reviews:
                  weakestTopic.reviews,
              }
            : null,

        targetPatterns,

        recommendations,
      });

    } catch (error) {

      console.error(
        "Recommendations error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to generate recommendations",
      });
    }
  }
);


module.exports = router;