<template>
  <f7-page>
    <f7-navbar :title="item.textInfo.title" back-link="Back" sliding></f7-navbar>
    
    </f7-block>
      <f7-buttons>
        <f7-button @click="switchTemplate" tab-link="#plain" active>純文字輸入</f7-button>
        <f7-button @click="switchTemplate" tab-link="#template" >使用模版</f7-button>
      </f7-buttons>
    </f7-block>

    <f7-tabs swipeable>
      <!-- first tab -->
      <f7-tab id="plain" active>
        <f7-list form class="close">
          <f7-list-item>
            <f7-label>項目名</f7-label>
            <f7-input type="text" placeholder="項目名" 
                      :value="item.textInfo.title" 
                      @change="event => {updateTextInfo('title', event.target.value)}" />
          </f7-list-item>
          <f7-list-item>
            <f7-label>細節 <br/> (300字內)</f7-label>
            <f7-input type="textarea" placeholder="項目細節"
                      :value="item.textInfo.details" 
                      @change="event => {updateTextInfo('details', event.target.value)}" />
          </f7-list-item>
          <f7-list-item smart-select title="工程項目">
            <select name="category" v-model="selectedProjectId" @change="updateProjectId">
              <option v-for="project in projects" :value="project.key" >
                {{project.name}}
              </option>
            </select>
          </f7-list-item>
          <f7-block class="close">
            <f7-button fill color="green" class="add-category"> 新增工程項目 </f7-button>
          </f7-block>
        </f7-list>
      </f7-tab>

      <!-- second tab -->
      <f7-tab id="template">
        <f7-list form class="close">
          <f7-list-item>
            <f7-label>項目名</f7-label>
            <f7-input type="text" placeholder="項目名" 
                      :value="item.textInfo.title" 
                      @change="event => {updateTextInfo('title', event.target.value)}" />
          </f7-list-item>
          <f7-list-item>
            <f7-label>細節</f7-label>
            <f7-input type="textarea" placeholder="項目細節"
                      :value="item.textInfo.details" 
                      @change="event => {updateTextInfo('details', event.target.value)}" />
          </f7-list-item>
          <f7-list-item>
            <f7-label>位置</f7-label>
            <f7-input type="text" placeholder="位置"
                      :value="item.textInfo.location" 
                      @change="event => {updateTextInfo('location', event.target.value)}" />
          </f7-list-item>
          <f7-list-item>
            <f7-label>取樣者</f7-label>
            <f7-input type="text" placeholder="取樣者" 
                      :value="item.textInfo.who" 
                      @change="event => {updateTextInfo('who', event.target.value)}" />
          </f7-list-item>
          <f7-list-item smart-select title="工程項目">
            <select name="category" v-model="selectedProjectId" @change="updateProjectId">
              <option v-for="project in projects" :value="project.key">
                {{project.name}}
              </option>
            </select>
          </f7-list-item>
          <f7-button class="add-category"> 新增工程項目 </f7-button>
        </f7-list>
      </f7-tab>
    </f7-tabs>

    </f7-page>
</template>

<script>
import Loader from '../loader/loader';

export default {
  data: function () {
    return {
      template: "plain",
      selectedProjectId: this.$store.state.currentProjectId
    }
  },
  computed: {
    project () {
      let project = this.$store.state.projects.filter(project=> {
        return project._id == this.projectId;
      })[0];
      return project;
    },
    projects () {
      return this.$store.state.projects;
    },
    item () {
      return this.$store.state.editingData;
    },
    mode () {
      return this.$store.state.mode;
    },
    projectId (){
      return this.$store.state.currentProjectId;
    },
    key () {
      return this.$store.state.currentItemKey;
    }
  },
  methods:{
    switchTemplate: function(event){
      this.template = event.target.getAttribute("data-tab").replace('#', '');
    },
    updateTextInfo: function (nodeName, value) {
      let payload = {
        nodeName: nodeName,
        value: value
      };
      this.$store.commit ("updateTextInfo", payload);
    },
    updateProjectId: function (event){ 
      this.$store.commit ("updateProjectId", event.target.value);
    },
    updateCategoryCB: function (){
      this.$f7.alert('新增完成');
    }
  },
  mounted(){
    this.$$('.add-category').on('click', () => {
        this.$f7.prompt('新增工程', '請填入工程名稱', (value) => {
            if(value !== "" || value !== null){
              this.$f7.alert('新增' + value + '工程');
              Loader.addProject (name, this.updateCategoryCB.bind (this));
            } else{
              this.$f7.alert('請填入名稱');
            }
        });
    });
  }
}
</script>