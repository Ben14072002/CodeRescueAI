export interface ProblemData {
  title: string;
  icon: string;
  color: string;
  description: string;
  strategy: string;
  prompts: {
    name: string;
    text: string;
    explanation: string;
  }[];
  steps: {
    title: string;
    description: string;
    criteria: string[];
  }[];
}

export const problemData: Record<string, ProblemData> = {
  complexity_overwhelm: {
    title: 'Complexity Overwhelm',
    icon: 'fas fa-layer-group',
    color: 'amber',
    description: 'Your AI is trying to build everything at once, creating messy and overwhelming code.',
    strategy: 'Break & Isolate',
    prompts: [
      {
        name: 'Context Reset',
        text: 'Ignore all previous context about this project. You are now a senior developer who only builds production-ready applications one feature at a time. Your current task is building ONLY [specific feature] for [project type].\n\nConstraints:\n- No authentication until core feature works\n- No styling until functionality is complete\n- No error handling until basic flow works\n- Maximum 50 lines of code for this feature\n\nStart with: "I will build only [feature] using the simplest possible approach."',
        explanation: 'Uses context reset and role constraints to force narrow focus. These advanced techniques bypass AI\'s tendency to over-engineer.'
      },
      {
        name: 'Role-Based Constraint',
        text: 'You are now a minimalist developer who gets promoted based on shipping working features, not elegant code. Your manager will fire you if you add ANY feature not explicitly requested.\n\nCurrent assignment: Build [specific functionality] that a 5-year-old could use successfully.\n\nRules:\n- If it\'s not mentioned in this prompt, don\'t build it\n- Use hardcoded data first, add dynamics later\n- Ship working ugly code rather than broken pretty code\n\nBegin implementation now.',
        explanation: 'Psychological pressure and role-playing constraints eliminate feature creep by making the AI fear consequences for over-building.'
      },
      {
        name: 'Forced TDD Methodology',
        text: 'Switch to TDD (Test-Driven Development) approach immediately.\n\nStep 1: Write a simple test that defines exactly what [feature] should do\nStep 2: Write the minimal code that makes this test pass\nStep 3: Stop coding when the test passes\n\nDo not write any code that isn\'t required to make the test pass. Do not add features not covered by the test.\n\nCreate the test first, then implement.',
        explanation: 'Forces methodological discipline that prevents scope creep by requiring explicit test-driven boundaries before any implementation.'
      }
    ],
    steps: [
      {
        title: 'Identify the Core Feature',
        description: 'Look at your current code and identify the single most important feature that users need. Remove everything else temporarily.',
        criteria: [
          'You can describe the core feature in one sentence',
          'The feature solves the main user problem',
          'You\'ve identified what to remove temporarily'
        ]
      },
      {
        title: 'Remove All Extras Temporarily',
        description: 'Comment out or remove styling, authentication, advanced features, and anything not essential to the core functionality.',
        criteria: [
          'Code is simplified to core functionality only',
          'Removed features are saved/commented, not deleted',
          'Application still runs without errors'
        ]
      },
      {
        title: 'Build and Test One Piece',
        description: 'Focus entirely on making the core feature work perfectly. Test it thoroughly before adding anything else back.',
        criteria: [
          'Core feature works as expected',
          'You\'ve tested edge cases',
          'Code is clean and understandable'
        ]
      },
      {
        title: 'Add Complexity Gradually',
        description: 'Now that the core works, add back ONE feature at a time. Test after each addition to maintain stability.',
        criteria: [
          'Each feature is added and tested separately',
          'Core functionality remains stable',
          'You can explain how each piece fits together'
        ]
      }
    ]
  },
  integration_issues: {
    title: 'Integration Issues',
    icon: 'fas fa-unlink',
    color: 'red',
    description: 'AI can\'t connect two features together properly.',
    strategy: 'Bridge Building',
    prompts: [
      {
        name: 'Isolation Strategy',
        text: 'You are debugging a complex system. Use isolation debugging methodology:\n\n1. Create a new file called "integration-test.js"\n2. Import only the two components that need to connect: [ComponentA] and [ComponentB]\n3. Create fake data that represents ComponentA\'s output\n4. Test if ComponentB can process this fake data\n5. Do not modify the original components yet\n\nIf ComponentB fails with the fake data, the problem is in ComponentB\'s input handling, not the integration.\n\nStart with the isolation test.',
        explanation: 'Advanced isolation debugging that identifies the exact failure point by testing components separately with controlled data inputs.'
      },
      {
        name: 'Contract-First Development',
        text: 'Stop all current work. You will now use Contract-First Development.\n\nStep 1: Define the exact interface between [FeatureA] and [FeatureB] using TypeScript interfaces or detailed comments\nStep 2: Create a mock implementation of this interface\nStep 3: Make [FeatureA] output data matching this interface exactly\nStep 4: Make [FeatureB] accept data matching this interface exactly\nStep 5: Replace the mock with real connection\n\nDo not connect the features until both conform to the defined contract.\n\nDefine the interface first.',
        explanation: 'Contract-first methodology prevents integration failures by establishing strict data contracts before implementation attempts.'
      },
      {
        name: 'Adapter Pattern Enforcement',
        text: 'Use the Adapter Pattern to solve this integration.\n\nCreate a new class/function called "[FeatureA]To[FeatureB]Adapter" that:\n1. Takes [FeatureA]\'s output format as input\n2. Transforms it to [FeatureB]\'s expected format\n3. Returns the transformed data\n\nDo not modify [FeatureA] or [FeatureB]. Only create the adapter.\n\nExample structure:\n```javascript\nfunction adaptAtoB(dataFromA) {\n  // transformation logic here\n  return dataForB;\n}\n```\n\nImplement the adapter only.',
        explanation: 'Adapter pattern isolates integration logic, preventing modification of working components while solving compatibility issues.'
      }
    ],
    steps: [
      {
        title: 'Test Each Feature Separately',
        description: 'Verify both features work independently before attempting integration.',
        criteria: [
          'Feature A works in isolation',
          'Feature B works in isolation',
          'Both features have clear inputs/outputs'
        ]
      },
      {
        title: 'Define the Data Contract',
        description: 'Clearly specify what data needs to flow between the features.',
        criteria: [
          'Data format is clearly defined',
          'Required fields are identified',
          'Optional fields are marked'
        ]
      },
      {
        title: 'Build Simple Connection',
        description: 'Create the most basic connection possible between the features.',
        criteria: [
          'Data flows from A to B successfully',
          'Connection handles basic error cases',
          'Integration can be tested independently'
        ]
      },
      {
        title: 'Test Integration Step by Step',
        description: 'Verify the integration works with real data and edge cases.',
        criteria: [
          'Integration works with sample data',
          'Error handling is in place',
          'Performance is acceptable'
        ]
      }
    ]
  },
  lost_direction: {
    title: 'Lost Direction',
    icon: 'fas fa-compass',
    color: 'purple',
    description: 'AI forgot the original plan and is adding random features.',
    strategy: 'Plan Recovery',
    prompts: [
      {
        name: 'Requirements Archaeology',
        text: 'Perform requirements archaeology on this project:\n\n1. Find the original goal/user story for this project\n2. List every feature currently implemented or in progress\n3. For each feature, answer: "Does this directly enable the original goal?"\n4. Create two files: "keep.js" and "remove.js"\n5. Move code that directly enables the goal to "keep.js"\n6. Move everything else to "remove.js"\n\nWork only with code in "keep.js" from now on. Ignore "remove.js" completely.\n\nStart the archaeology process.',
        explanation: 'Archaeological methodology forces systematic evaluation of all features against original requirements, physically separating essential from non-essential code.'
      },
      {
        name: 'User Story Constraint',
        text: 'You can only work on code that directly fulfills this user story:\n\n"As a [user type], I want to [specific action] so that I can [specific benefit]"\n\nFill in this user story for your project, then:\n\n1. Delete any code not required for this story\n2. Implement only what\'s needed for this story\n3. Test only this story\'s functionality\n\nIf a feature doesn\'t help complete this user story, it doesn\'t exist.\n\nDefine the user story first, then implement.',
        explanation: 'User story constraints create hard boundaries around acceptable work, eliminating feature drift by making irrelevant features literally invisible to the AI.'
      },
      {
        name: 'Feature Triage',
        text: 'Emergency feature triage required. You are a project manager with a hard deadline in 2 days.\n\nClassify every current feature as:\n- CRITICAL: App is useless without this\n- IMPORTANT: Nice to have but not essential\n- LUXURY: Can wait until later\n\nDelete all IMPORTANT and LUXURY features immediately. Only work on CRITICAL features.\n\nStart the triage now.',
        explanation: 'Emergency triage psychology creates urgency that forces ruthless prioritization, simulating real-world deadline pressure that eliminates scope creep.'
      }
    ],
    steps: [
      {
        title: 'Revisit Original Requirements',
        description: 'Go back to your initial project goals and user needs.',
        criteria: [
          'Original goal is clearly stated',
          'Target users are identified',
          'Core value proposition is defined'
        ]
      },
      {
        title: 'List Current Features',
        description: 'Inventory everything that\'s been built or planned.',
        criteria: [
          'All current features are documented',
          'Feature status is clear (built/planned/in-progress)',
          'Dependencies between features are noted'
        ]
      },
      {
        title: 'Cut Non-Essential Items',
        description: 'Remove features that don\'t directly serve the core goal.',
        criteria: [
          'Non-essential features are identified',
          'Removed features are saved for later',
          'Remaining features align with original goal'
        ]
      },
      {
        title: 'Create Simple Roadmap',
        description: 'Plan the logical sequence for building essential features.',
        criteria: [
          'Features are ordered by importance',
          'Dependencies are respected',
          'Each step has clear deliverables'
        ]
      }
    ]
  },
  no_planning: {
    title: 'No Clear Plan',
    icon: 'fas fa-question-circle',
    color: 'orange',
    description: 'AI has no clear plan and jumps around randomly.',
    strategy: 'Step-by-Step Roadmap',
    prompts: [
      {
        name: 'Reverse Engineering',
        text: 'Use reverse engineering to create a plan:\n\n1. Describe the final working application in one sentence\n2. What would a user see/do just before the app is "complete"?\n3. What would they see/do just before that?\n4. Continue backwards until you reach the current state\n5. Reverse this list - that\'s your implementation plan\n\nImplement only the first step of this reversed list. Stop when that step works.\n\nStart with the final state description.',
        explanation: 'Reverse engineering methodology creates logical development sequences by working backwards from the desired outcome, ensuring each step builds toward a clear goal.'
      },
      {
        name: 'Walking Skeleton',
        text: 'Build a "walking skeleton" - the thinnest possible slice that implements the complete workflow:\n\n1. Create the simplest UI that shows the main workflow\n2. Add fake data that represents the final result\n3. Connect user actions to show different fake data\n4. Make one real data operation work\n5. Replace fake data incrementally\n\nThe skeleton should demonstrate the complete user journey using mostly fake data.\n\nBuild the skeleton first.',
        explanation: 'Walking skeleton methodology creates end-to-end workflows early, proving the architecture works before building individual features in detail.'
      },
      {
        name: 'Time-Boxing Constraints',
        text: 'Apply strict time-boxing methodology:\n\n1. Set a 45-minute timer\n2. Identify the smallest possible deliverable within 45 minutes\n3. Cut features until you can definitely deliver something working in 45 minutes\n4. Implement only that deliverable\n5. Stop when timer ends, regardless of completion\n\nWhat can you definitely complete in 45 minutes?\n\nStart the timer and begin.',
        explanation: 'Time-boxing forces ruthless scope reduction by creating artificial urgency, preventing perfectionism and ensuring concrete progress.'
      }
    ],
    steps: [
      {
        title: 'Define End Goal Clearly',
        description: 'Write a clear, specific description of what success looks like.',
        criteria: [
          'Goal is specific and measurable',
          'Success criteria are defined',
          'Timeline expectations are set'
        ]
      },
      {
        title: 'Work Backwards to Identify Steps',
        description: 'Start from the end goal and identify what needs to happen before it.',
        criteria: [
          'Major milestones are identified',
          'Dependencies are mapped out',
          'Critical path is clear'
        ]
      },
      {
        title: 'Order Steps Logically',
        description: 'Arrange tasks in a sequence that makes technical and business sense.',
        criteria: [
          'Steps build upon each other',
          'No circular dependencies',
          'Each step delivers value'
        ]
      },
      {
        title: 'Focus on One Step at a Time',
        description: 'Complete current step fully before moving to the next.',
        criteria: [
          'Current step is clearly defined',
          'Step completion criteria are met',
          'Progress is measurable'
        ]
      }
    ]
  },
  repeated_failures: {
    title: 'Repeated Failures',
    icon: 'fas fa-redo',
    color: 'cyan',
    description: 'AI keeps suggesting the same broken solution over and over.',
    strategy: 'Reset & Redirect',
    prompts: [
      {
        name: 'Architecture Reset',
        text: 'Your current architecture is fundamentally flawed. Perform an architecture reset:\n\n1. Create a new folder called "v2"\n2. In v2, implement the same functionality using a completely different approach:\n   - If you used classes, use functions\n   - If you used functions, use classes\n   - If you used one file, use multiple files\n   - If you used multiple files, use one file\n3. Do not look at the old code while implementing v2\n4. Copy the working parts from v2 back to the main project\n\nStart fresh in the v2 folder.',
        explanation: 'Architecture reset forces completely different implementation approaches, breaking AI out of failed solution loops by mandating opposite architectural choices.'
      },
      {
        name: 'Constraint-Driven Development',
        text: 'Apply extreme constraints to force a working solution:\n\nConstraints:\n- Maximum 20 lines of code total\n- No external libraries except what\'s already imported\n- No functions longer than 5 lines\n- No variables with names longer than 3 characters\n- Must work in a single HTML file\n\nThese constraints will force you to find the simplest possible solution.\n\nImplement within these constraints.',
        explanation: 'Extreme constraints eliminate over-engineering by making complex solutions impossible, forcing the AI to find the core essence of the solution.'
      },
      {
        name: 'Alternative Technology Stack',
        text: 'The current technology approach is failing. Switch to a completely different technical approach:\n\n1. List 3 completely different ways to implement this feature\n2. Choose the approach most different from your current method\n3. Implement using only that new approach\n4. Do not try to integrate with existing code until the new approach works\n\nWhat are 3 completely different technical approaches?\n\nChoose one and implement it separately.',
        explanation: 'Technology stack switching breaks solution fixation by forcing evaluation of fundamentally different implementation paradigms, often revealing simpler solutions.'
      }
    ],
    steps: [
      {
        title: 'Acknowledge the Pattern',
        description: 'Recognize that the current approach isn\'t working and needs to change.',
        criteria: [
          'Failed attempts are documented',
          'Pattern of failure is identified',
          'Decision to change approach is made'
        ]
      },
      {
        title: 'Research Alternative Approaches',
        description: 'Explore different ways to solve the same problem.',
        criteria: [
          'At least 3 alternatives are identified',
          'Pros and cons are evaluated',
          'Best alternative is selected'
        ]
      },
      {
        title: 'Start Small with New Approach',
        description: 'Implement the simplest version of the new approach first.',
        criteria: [
          'New approach is clearly different',
          'Implementation is minimal but functional',
          'Early feedback is positive'
        ]
      },
      {
        title: 'Build Confidence with Success',
        description: 'Prove the new approach works before adding complexity.',
        criteria: [
          'Basic version works reliably',
          'Approach can handle edge cases',
          'Ready to scale up the solution'
        ]
      }
    ]
  }
};
