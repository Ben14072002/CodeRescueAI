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
        name: 'Quick Focus',
        text: 'Stop. Build only [specific feature] first. Ignore user authentication, styling, advanced features, and everything else. Just create a simple list where I can add and remove items. Show me this working before we add anything else.',
        explanation: 'Forces AI to focus on one core feature only'
      },
      {
        name: 'Minimal Version',
        text: 'Create a minimal working version of this feature that I can test separately. What\'s the simplest possible version that still demonstrates the core functionality?',
        explanation: 'Encourages building testable increments'
      },
      {
        name: 'Gradual Build',
        text: 'We\'re adding too much complexity at once. Let\'s step back and identify the absolute core feature. What\'s the ONE thing this app must do to be useful?',
        explanation: 'Helps identify true MVP features'
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
        name: 'Simple Bridge',
        text: 'Create a simple data bridge between Feature A and Feature B. Test the connection with fake data first.',
        explanation: 'Establishes basic connection before complexity'
      },
      {
        name: 'Minimal Interface',
        text: 'What\'s the minimal interface these two features need to share? Let\'s define just the essential data contract.',
        explanation: 'Focuses on core data requirements'
      },
      {
        name: 'Step by Step',
        text: 'Let\'s test each feature separately first, then build the simplest possible connection between them.',
        explanation: 'Validates components before integration'
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
        name: 'Back to Basics',
        text: 'Here\'s my original goal: [user inputs goal]. What should I remove to get back on track?',
        explanation: 'Refocuses on original objectives'
      },
      {
        name: 'Essential Features',
        text: 'Show me the 3 most important features for my original vision. Everything else can wait.',
        explanation: 'Prioritizes core functionality'
      },
      {
        name: 'MVP Reset',
        text: 'What\'s the minimum viable version of what I wanted to build? Let\'s start there.',
        explanation: 'Reduces scope to essentials'
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
        name: 'Five Steps',
        text: 'Break this project into 5 logical steps I can build one at a time. What\'s step 1?',
        explanation: 'Creates manageable development phases'
      },
      {
        name: 'Just Step One',
        text: 'What\'s step 1 of building this? Just step 1, nothing else. Make it something I can complete in 30-60 minutes.',
        explanation: 'Focuses on immediate next action'
      },
      {
        name: 'Time-Boxed Tasks',
        text: 'Create a checklist where each item takes 30-60 minutes max. What\'s the first item?',
        explanation: 'Breaks work into manageable chunks'
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
        name: 'Fresh Approach',
        text: 'This approach isn\'t working. Let\'s try a completely different method. What are 3 alternative ways to solve this?',
        explanation: 'Forces exploration of alternatives'
      },
      {
        name: 'Simplify the Problem',
        text: 'Let\'s solve a simpler version of this problem first. What\'s the easiest version that would still be useful?',
        explanation: 'Reduces complexity to build confidence'
      },
      {
        name: 'Start from Scratch',
        text: 'Let\'s start this feature over with a different approach. What would you do differently this time?',
        explanation: 'Encourages fresh perspective'
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
