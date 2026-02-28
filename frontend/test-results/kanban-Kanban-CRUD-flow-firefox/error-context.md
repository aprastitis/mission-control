# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - button "Light" [ref=e4]
      - button "Dark" [ref=e5]
      - button "System" [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: 📋 Backlog
        - button "+ Add Task" [ref=e11]
        - generic [ref=e13]: No tasks? Add one
      - generic [ref=e14]:
        - generic [ref=e15]: 🚀 In Progress
        - generic [ref=e17]: No tasks in progress.
      - generic [ref=e18]:
        - generic [ref=e19]: ✅ Need Approval
        - generic [ref=e21]: No tasks awaiting approval.
      - generic [ref=e22]:
        - generic [ref=e23]: 🎉 Done
        - generic [ref=e25]: No completed tasks yet.
    - form "Create New Task" [ref=e27]:
      - heading "Create New Task" [level=2] [ref=e28]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Title *
          - textbox "Title *" [ref=e32]: Test Task 1772295466264
        - generic [ref=e33]:
          - generic [ref=e34]: Description
          - textbox "Description" [active] [ref=e35]: Test description
      - generic [ref=e36]:
        - button "Cancel" [ref=e37]
        - button "Create Task" [ref=e38]
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - alert [ref=e49]
```