import Vue from 'vue'
import Vuex from 'vuex'
import Loader from '../loader/loader.js';

Vue.use(Vuex)

const itemDataDefault  = {
  id: 0,
  projectId: 0,
  boardlocation: {x: 100, y: 100},
  drawArray: {
    color:"#3f51b5",
    clickX: [],
    clickY: [],
    clickDrag: []
  },
  lastUpdate: new Date ().getTime (),
  imageUrl:  'images/' + new Date ().getTime () + '.jpg',
  useTemplate: false,
  textInfo: {
    title: "",
    details: "",
    location: "",
    who: ""
  }
};

const updateProjectInfoWithItems = (items, projects) => {
  
  projects.forEach( project =>{
    let projectItems = items.filter(item => {
      return project.key == item.projectId; 
    });
    project.length = projectItems.length;
    
    if(projectItems.length > 0)
    {
      projectItems.sort ((a, b)=>{
        return a.lastUpdate - b.lastUpdate;
      });
      project.imageUrl = projectItems[0].imageUrl;
      project.lastUpdate = projectItems[0].lastUpdate;
    } else {
      project.imageUrl = "";
      project.lastUpdate = project.lastUpdate;
    }
  });

  return projects;
}

// stat
export default new Vuex.Store({
    state: {
      mode: 'new',
      imageData: null,
      editingData: {},
      projects: [],
      items: [],
      currentProjectId: 0,
      currentItemKey: 0
    },
    mutations: {
      setProjects (state, projects)
      {
        let projectAddedInfo = projects;

        if (state.items !== undefined) {
          projectAddedInfo = updateProjectInfoWithItems (state.items, projects);
        }

        state.projects = projectAddedInfo;
      },
      setItems (state, items)
      {
        state.items = items;
        state.projects = updateProjectInfoWithItems (state.items, state.projects);        
      },
      addNewItem (state)
      {
        state.mode = 'new';
        state.editingData = Object.assign({}, itemDataDefault);
        state.currentProjectId = 0;
        state.currentItemKey = 0;
      },
      editItem (state, itemKey)
      {
        state.mode = 'edit';
        if (itemKey !== 0){
          state.editingData = state.items.slice().filter (item => {
            return item.key === itemKey;
          })[0];
          state.currentProjectId = state.editingData.projectId;
          state.currentItemKey = itemKey;
        }
      },
      storeImage (state, imageData)
      {
        state.imageData = imageData;  
      },
      updateTextInfo (state, payload)
      {
        state.editingData.textInfo[payload.nodeName] = payload.value;
      },
      updateProjectId (state, id) {
        state.currentProjectId = id;
        state.editingData.projectId = id;
      },
      setCurrentProjectId (state, id){
        state.currentProjectId = id;
      }
    }
});