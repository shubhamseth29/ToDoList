const listsContainer = document.getElementById('allLists')
const newListForm = document.getElementById('addList')
const newListInput = document.getElementById('listInput')
const deleteListButton = document.getElementById('data-delete-list-button')
const listDisplayContainer = document.getElementById('allTasks')
const listTitleElement = document.getElementById('data-list-title')
// const listCountElement = document.getElementById('[data-list-count]')
const tasksContainer = document.getElementById('data-tasks')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.getElementById('data-new-task-form')
const newTaskInput = document.getElementById('data-new-task-input')
const clearCompleteTasksButton = document.getElementById('data-clear-complete-tasks-button')
const quoteBtn=document.getElementById("quoteBtn")
const quoteAuthor=document.getElementById("quoteAuthor")
const quoteText=document.getElementById("quoteText")

const LOCAL_STORAGE_LIST_KEY = 'tasks.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'tasks.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    // renderTaskCount(selectedList)
  }
})

clearCompleteTasksButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()
  const listName = newListInput.value
  if (listName == null || listName === '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()
  const taskName = newTaskInput.value
  if (taskName == null || taskName === '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function render() {
  clearElement(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    // renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

// function renderTaskCount(selectedList) {
//   const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
//   const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
//   listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
// }

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add("listName")
    listElement.innerText = list.name
    // if (list.id === selectedListId) {
    //   listElement.classList.add('active-list')
    // }
    listsContainer.appendChild(listElement)
  })
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

quoteBtn.addEventListener('click',(e)=>{
    fetch("http://quotable.io/random")
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        quoteText.innerHTML=`"${data.content}"`;
        quoteAuthor.innerHTML=data.author;
    })
})

render()

