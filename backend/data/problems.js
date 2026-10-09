const problems = [
  // =========================
  // ARRAYS
  // =========================

  {
    platform: "LeetCode",
    title: "Two Sum",
    topic: "Arrays",
    subtopic: "Hashing",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://leetcode.com/problems/two-sum/",
    reason: "Good foundation for array and hashing techniques.",
  },

  {
    platform: "LeetCode",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    subtopic: "Greedy",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    reason: "Builds basic one-pass array reasoning.",
  },

  {
    platform: "CSES",
    title: "Maximum Subarray Sum",
    topic: "Arrays",
    subtopic: "Kadane's Algorithm",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://cses.fi/problemset/task/1643/",
    reason: "Important basic pattern for maximum subarray problems.",
  },

  // =========================
  // GRAPHS
  // =========================

  {
    platform: "LeetCode",
    title: "Number of Islands",
    topic: "Graphs",
    subtopic: "BFS / DFS",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 1,
    oaSource: false,
    url: "https://leetcode.com/problems/number-of-islands/",
    reason: "Strong starting point for graph traversal.",
  },

  {
    platform: "GFG",
    title: "BFS of Graph",
    topic: "Graphs",
    subtopic: "BFS",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
    reason: "Builds the basic BFS traversal pattern.",
  },

  {
    platform: "GFG",
    title: "DFS of Graph",
    topic: "Graphs",
    subtopic: "DFS",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1",
    reason: "Builds the basic DFS traversal pattern.",
  },

  {
    platform: "CSES",
    title: "Building Roads",
    topic: "Graphs",
    subtopic: "Connected Components",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://cses.fi/problemset/task/1666/",
    reason: "Useful for understanding connected components.",
  },

  {
    platform: "LeetCode",
    title: "Is Graph Bipartite?",
    topic: "Graphs",
    subtopic: "Bipartite Graph",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/is-graph-bipartite/",
    reason: "Important bipartite graph problem highlighted in the OA guide.",
  },

  {
    platform: "LeetCode",
    title: "Possible Bipartition",
    topic: "Graphs",
    subtopic: "Bipartite Graph",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/possible-bipartition/",
    reason: "Applies bipartite graph detection to an OA-style problem.",
  },

  {
    platform: "CSES",
    title: "Shortest Routes I",
    topic: "Graphs",
    subtopic: "Dijkstra",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 1,
    oaSource: false,
    url: "https://cses.fi/problemset/task/1671/",
    reason: "Core Dijkstra problem for weighted shortest paths.",
  },

  {
    platform: "LeetCode",
    title: "Cheapest Flights Within K Stops",
    topic: "Graphs",
    subtopic: "Shortest Path",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 2,
    oaSource: true,
    url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    reason: "Good progression after learning basic shortest paths.",
  },

  {
    platform: "LeetCode",
    title: "Minimum Obstacle Removal to Reach Corner",
    topic: "Graphs",
    subtopic: "0-1 BFS",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/",
    reason: "The OA guide specifically recommends solving this using 0-1 BFS.",
  },

  {
    platform: "LeetCode",
    title: "Collect Coins in a Tree",
    topic: "Graphs",
    subtopic: "Tree Pruning",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/collect-coins-in-a-tree/",
    reason: "Important tree-pruning problem highlighted in the OA guide.",
  },

  {
    platform: "LeetCode",
    title: "Longest Cycle in a Graph",
    topic: "Graphs",
    subtopic: "Topological Sort",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/longest-cycle-in-a-graph/",
    reason: "The guide specifically emphasizes understanding this through topological sorting.",
  },

  {
    platform: "LeetCode",
    title: "Number of Good Paths",
    topic: "Graphs",
    subtopic: "DSU",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/number-of-good-paths/",
    reason: "Important DSU problem highlighted as OA and interview relevant.",
  },

  {
    platform: "Codeforces",
    title: "Rerooting Tree",
    topic: "Graphs",
    subtopic: "Rerooting DP",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://codeforces.com/contest/1324/problem/F",
    reason: "The OA guide specifically recommends this for rerooting DP.",
  },

  {
    platform: "Codeforces",
    title: "Choosing Capital for Treeland",
    topic: "Graphs",
    subtopic: "Rerooting DP",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://codeforces.com/contest/219/problem/D",
    reason: "Important rerooting DP problem highlighted in the OA guide.",
  },

  // =========================
  // STACK
  // =========================

  {
    platform: "LeetCode",
    title: "Next Greater Element I",
    topic: "Stack",
    subtopic: "Monotonic Stack",
    difficulty: "Easy",
    difficultyRank: 1,
    priority: 1,
    oaSource: false,
    url: "https://leetcode.com/problems/next-greater-element-i/",
    reason: "Introduces the monotonic stack pattern.",
  },

  {
    platform: "LeetCode",
    title: "Daily Temperatures",
    topic: "Stack",
    subtopic: "Monotonic Stack",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 1,
    oaSource: false,
    url: "https://leetcode.com/problems/daily-temperatures/",
    reason: "Excellent progression for monotonic stack.",
  },

  {
    platform: "LeetCode",
    title: "Sum of Subarray Minimums",
    topic: "Stack",
    subtopic: "Contribution Technique",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/sum-of-subarray-minimums/",
    reason: "The OA guide specifically highlights stack contribution technique.",
  },

  {
    platform: "Codeforces",
    title: "Array and Operations",
    topic: "Stack",
    subtopic: "Contribution Technique",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://codeforces.com/contest/817/problem/D",
    reason: "Highlighted as an important contribution-technique problem in the OA guide.",
  },

  // =========================
  // DP
  // =========================

  {
    platform: "LeetCode",
    title: "House Robber",
    topic: "Dynamic Programming",
    subtopic: "1D DP",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 1,
    oaSource: true,
    url: "https://leetcode.com/problems/house-robber/",
    reason: "Fundamental 1D DP pattern.",
  },

  {
    platform: "LeetCode",
    title: "Maximum Profit in Job Scheduling",
    topic: "Dynamic Programming",
    subtopic: "DP + Binary Search",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 2,
    oaSource: true,
    url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
    reason: "Useful progression into optimization-heavy DP.",
  },

  {
    platform: "LeetCode",
    title: "Cherry Pickup",
    topic: "Dynamic Programming",
    subtopic: "2D DP",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/cherry-pickup/",
    reason: "Marked as very important in the OA guide.",
  },

  {
    platform: "Codeforces",
    title: "New Building",
    topic: "Dynamic Programming",
    subtopic: "DP",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://codeforces.com/blog/entry/127501",
    reason: "The attached guide highlights this as a very important DP concept.",
  },

  // =========================
  // GREEDY
  // =========================

  {
    platform: "LeetCode",
    title: "Gas Station",
    topic: "Greedy",
    subtopic: "Greedy",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/gas-station/",
    reason: "Important greedy problem explicitly highlighted in the OA guide.",
  },

  {
    platform: "LeetCode",
    title: "Candy",
    topic: "Greedy",
    subtopic: "Greedy",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/candy/",
    reason: "Important greedy problem highlighted for OA preparation.",
  },

  // =========================
  // TRIE / STRING
  // =========================

  {
    platform: "LeetCode",
    title: "Longest Happy Prefix",
    topic: "Strings",
    subtopic: "String Matching",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/longest-happy-prefix/",
    reason: "Important string-pattern problem from the OA guide.",
  },

  {
    platform: "LeetCode",
    title: "Shortest Palindrome",
    topic: "Strings",
    subtopic: "String Matching",
    difficulty: "Hard",
    difficultyRank: 3,
    priority: 3,
    oaSource: true,
    url: "https://leetcode.com/problems/shortest-palindrome/",
    reason: "The guide specifically marks this as very important.",
  },

  {
    platform: "Codeforces",
    title: "Maximum Xor Secondary",
    topic: "Trie",
    subtopic: "Bitwise",
    difficulty: "Medium",
    difficultyRank: 2,
    priority: 2,
    oaSource: true,
    url: "https://codeforces.com/contest/627/problem/A",
    reason: "The guide connects this concept with XOR and bitmask OA problems.",
  },
];

module.exports = problems;