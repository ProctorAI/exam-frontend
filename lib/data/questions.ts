export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOption: string;
}

export interface ExamData {
  id: string;
  title: string;
  duration: number; // in seconds
  questions: Question[];
}

export const mockExam: ExamData = {
  id: "cs-fundamentals-1",
  title: "Computer Science Fundamentals",
  duration: 1800, // 30 minutes
  questions: [
    {
      id: "q1",
      text: "Which data structure would be most efficient for implementing a cache with a 'least recently used' eviction policy?",
      options: [
        { id: "a", text: "Array" },
        { id: "b", text: "Hash Map with Doubly Linked List" },
        { id: "c", text: "Binary Search Tree" },
        { id: "d", text: "Stack" },
      ],
      correctOption: "b"
    },
    {
      id: "q2",
      text: "What is the time complexity of quicksort in the average case?",
      options: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(n log n)" },
        { id: "c", text: "O(n²)" },
        { id: "d", text: "O(log n)" },
      ],
      correctOption: "b"
    },
    {
      id: "q3",
      text: "Which of the following is NOT a principle of Object-Oriented Programming?",
      options: [
        { id: "a", text: "Encapsulation" },
        { id: "b", text: "Normalization" },
        { id: "c", text: "Inheritance" },
        { id: "d", text: "Polymorphism" },
      ],
      correctOption: "b"
    },
    {
      id: "q4",
      text: "In the context of REST APIs, what does HATEOAS stand for?",
      options: [
        { id: "a", text: "Hypertext As The Engine Of Application State" },
        { id: "b", text: "High Availability Through Elastic Object Access Service" },
        { id: "c", text: "Hierarchical Access To External Object Access Systems" },
        { id: "d", text: "Handling Asynchronous Transactions Easily Over Application Services" },
      ],
      correctOption: "a"
    },
    {
      id: "q5",
      text: "Which of the following is true about virtual memory?",
      options: [
        { id: "a", text: "It's faster than physical memory" },
        { id: "b", text: "It uses disk space to extend RAM" },
        { id: "c", text: "It's only available in 64-bit systems" },
        { id: "d", text: "It reduces the need for memory management" },
      ],
      correctOption: "b"
    }
  ]
}; 