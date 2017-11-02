<template>
  <f7-page>
    <f7-navbar :title="project.name" back-link="Back" sliding></f7-navbar>
    <f7-link v-for="item in items" class="item"
            @click="setItemInfo(item.key)" 
            :href="'/item/' + item.key"
            :ref="item.key">
      <img class="item-thumbnail" :src="setImage(item.imageUrl, item.key)"/>
    </f7-link>
  </f7-page>
</template>

<script>
import Loader from '../loader/loader.js'

export default {
  computed: {
    project () {
      let project = this.$store.state.projects.slice().filter(project=>{
        return project.key == this.$store.state.currentProjectId;
      })[0];
      return project;
    },
    items () {
      let items = this.$store.state.items.slice().filter(item=>{
        return item.projectId == this.$store.state.currentProjectId;
      });
      return items;
    }
  },
  methods:{
    setImage (imageUrl, refName) {
      let that = this;
        Loader.getDownloadLink (imageUrl).then( url =>{
          let element = that.$refs[refName][0].$el.getElementsByClassName('item-thumbnail')[0];
          element.src = url.toString();
        });  
      return 'db/img/loading.gif';
    },
    setItemInfo: function(itemKey) {
      this.$store.commit ("editItem", itemKey);
    }
  }
}

</script>