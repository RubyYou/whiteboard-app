<template>
  <f7-page>
    <f7-navbar title="管理專案" back-link="Back" sliding></f7-navbar>
        <f7-list form class="close">
            <f7-list-item v-for="project in projects">
                <f7-label>專案名</f7-label>
                <f7-input type="text" :value="project.name" 
                          @keyup.enter="event => udpateProject(project.key, event.target.value)" />
                <f7-link icon-f7="trash" color="pink" @click="deleteProject(project.key, project.name)"></f7-link>
            </f7-list-item>
        </f7-list>
        <f7-block class="close">
            <f7-button class="add-category"> 新增工程項目 </f7-button>
        </f7-block>
  </f7-page>
</template>

<script>
import Loader from '../loader/loader.js'

export default {
  computed: {
    projects () {
      return this.$store.state.projects;
    }
  },
  methods:{
    udpateProject: function (key, value) {
        Loader.updateProject (key, value);
    },
    deleteProject: function (key, name) {
        this.$f7.confirm ('確定刪除' + name +'?',
            function (ok) {
                Loader.deleteProject(key);
            }
        )
        // this will delete all the rest of information ?
    },
    updateProjectCB: function () {
        this.$f7.alert('新增完成');
    }
  },
  mounted() {
      this.$$('.add-category').on('click', () => {
        this.$f7.prompt('新增工程', '請填入工程名稱', (value) => {
            if(value !== "" || value !== null){
              this.$f7.alert('新增' + value + '工程');
              Loader.addProject (name, this.updateProjectCB.bind (this));
            } else{
              this.$f7.alert('請填入名稱');
            }
        });
    });
  }
}

</script>