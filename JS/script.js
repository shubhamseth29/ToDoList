const listInput=document.getElementById("listInput")
const allLists=document.getElementById("listList")
const addList=document.getElementById("addList")


const LOCAL_STORAGE_LIST_KEY = 'task.lists'
let lists=JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

addList.addEventListener('submit',(e)=>
{   

    e.preventDefault()
    const listName=listInput.value
    if(listName==null || listName==='') return
    lists.push({id: Date.now().toString(), name:listName, tasks: []})
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    listInput.value=null
    lists.forEach(list=>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("listName")
        listElement.innerText = list.name
        allLists.appendChild(listElement)
    })
   

})


