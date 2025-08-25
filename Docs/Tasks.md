# AI Model Explorer Assistant - Task List

This document outlines the tasks required to complete the AI Model Explorer Assistant based on the PRD.

---

### Phase 1: Foundations & Core Functionality (Current Gap)

- [ ] **Configure Environment:**
    - [ ] Create a `.env.example` file to document required variables.
    - [ ] Populate the local `.env` file with `VITE_HUGGINGFACE_API_KEY` and `VITE_OPENROUTER_API_KEY`.
- [ ] **Implement Filtering UI:**
    - [ ] Add a **Model Type** dropdown to the main interface (populated with values like `text-generation`, `text-to-image`, etc.).
    - [ ] Add a **Sort By** dropdown to the main interface (`downloads`, `likes`, `trending`).
    - [ ] Connect the dropdowns to the `handleSendMessage` function to pass filters to the API.
- [ ] **Refine API Logic:**
    - [ ] Modify `huggingfaceApi.ts` to return the **top 5** models as required, instead of 10.

---

### Phase 2: Model Display & Presentation

- [ ] **Enhance Model Card:**
    - [ ] Add the model **provider** (e.g., "meta-llama") to the `ModelCard` component.
    - [ ] Create a function to generate a simple Python **code snippet** for each model based on its `pipeline_tag`.
    - [ ] Add an expandable section to the `ModelCard` to show the code snippet.
- [ ] **Automate AI Summaries:**
    - [ ] Instead of requiring a click, automatically fetch and display the AI-generated summary for each of the 5 models returned in the search results.

---

### Phase 3: AI Assistant & Conversational Context

- [ ] **Implement Conversational Logic:**
    - [ ] Modify the `handleSendMessage` function in `App.tsx` to differentiate between an initial search and a follow-up question.
    - [ ] If it's a follow-up, send the conversation history and the last set of model results to the OpenRouter API for a context-aware response.
- [ ] **Manage Chat Context:**
    - [ ] Store the last selected filters (Model Type, Sort By) and the last set of model results in the `App.tsx` state to maintain context for the AI assistant.

---

### Phase 4: UX & Polish

- [ ] **Improve User Experience:**
    - [ ] Add clear loading indicators while the AI assistant is thinking.
    - [ ] Implement more robust error handling for API failures.
    - [ ] Create simple onboarding instructions or placeholder text to guide new users.
- [ ] **Final Review:**
    - [ ] Conduct a final review of the application against the PRD to ensure all requirements are met.
