
<!-- Save this just to check module, delete afte all test finished -->
<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>工程白版專案</f7-nav-center>
        </f7-navbar>
        
        <!-- Pages -->
        <f7-pages>
          <f7-page>
            <!-- Material Theme Navbar -->
            <f7-navbar v-if="$theme.material">
              <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
              </f7-nav-left>
              <f7-nav-center sliding></f7-nav-center>
              <f7-nav-right>
                <f7-link icon="icon-bars" open-panel="right"></f7-link>
              </f7-nav-right>
            </f7-navbar>
            <f7-block v-if="projects.length === 0" style="text-align:center;">
                <img class="loading" src='img/logo.png' />
                <p>Loading ...</p>
            </f7-block>
            <f7-list media-list class="close"  v-if="projects.length > 0">
              <f7-list-item 
                v-for="project in projects" :title="project.name"
                :ref="project.key"
                :link="'/project/' + project.key" 
                @click="setProjectId(project.key)"
                :text="setDate(project.lastUpdate)"
                :media="setImage(project.imageUrl, project.key)"
                :subtitle="'共 ' + project.length + ' 張照片'">
              </f7-list-item>
            </f7-list>
            <f7-block class="close">
              <f7-grid>
                <f7-col><f7-button fill color="pink" href="/camera/"> 新增項目</f7-button></f7-col>
                <f7-col><f7-button fill color="blue" href="/editProject/"> 管理專案</f7-button></f7-col>
              </f7-grid>
            </f7-block>
          </f7-page>
          </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
import Loader from './loader/loader.js';

export default {
  computed: {
    projects () {
      return this.$store.state.projects;
    },
    items () {
      return this.$store.state.items;
    }
  },
  methods:{
    setDate (epoch) {
      const date = new Date(parseInt(epoch));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const fullDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

      return "最後上傳 " + fullDate;
    },
   setImage (imageUrl, refName) {
      let that = this;

      if (imageUrl.length > 0)
      {
        // because this is a firebase promise object, 
        // and f7 don't accept f7 promise in it's property
        Loader.getDownloadLink (imageUrl).then( url =>{
          let element = that.$refs[refName][0].$el.getElementsByClassName('project-thumbnail')[0];
          element.src = url.toString();
        });  
      }

      return "<img class='project-thumbnail' src='db/img/loading.gif'/>";
    },
    setProjectId(key){
      this.$store.commit('setCurrentProjectId', key);
    }
  }
}
</script>