<template>
  <f7-page class="item">
    <f7-navbar >
      <f7-nav-left v-if="mode === 'edit'" back-link="Back" sliding></f7-nav-left>
      <f7-nav-left v-if="mode === 'new'">
        <f7-link href='/camera/'> 重新照 </f7-link>
      </f7-nav-left>
      <f7-nav-center>{{item.textInfo.title}}</f7-nav-center>
      <f7-nav-right>
        <f7-link ref="editText" @click="toggleEdit">編輯</f7-link>
      </f7-nav-right>
    </f7-navbar> 

    <img v-if="key !== 0" ref="itemImg" class ="item-img" :src="setImage (item.imageUrl,'itemImg')">
    <img v-if="key === 0" class ="item-img" :src="imageData">
    <canvas id="canvas"></canvas>
    <f7-block> 
      <div class="board" ref="board" 
        @mousedown="startMoveBoard" @mouseup="endMoveBoard"
        @touchstart="startMoveBoard" @touchend="endMoveBoard">
        <h4>項目名: {{item.textInfo.title}}</h4>
        <p>細節: {{item.textInfo.details}}</p>
        <p v-if="item.textInfo.location !== ''" >地點: {{item.textInfo.location}}</p>
        <p v-if="item.textInfo.who !== ''" >取樣者: {{item.textInfo.who}}</p>
        <f7-button ref="edit-btn" class="edit-btn" :href="'/edit/' + key">編輯文字</f7-button>
      </div>
      <div class="control" ref="control">
        <div class="draw-control">
          <span class="title">換顏色</span>
          <button v-for="color in colors" 
                  :class="'color ' + color.class" 
                  @click="chooseColor(color.code)">
          </button>
          <button class="reset" @click="clean">清除</button>
        </div>
        <f7-grid v-if="inputChecked === true">
          <f7-col>
            <f7-button fill color="blue" @click="updateItem">送出</f7-button>
          </f7-col>
          <f7-col v-if="mode === 'edit'">
            <f7-button fill color="pink" @click="deleteItem"> 刪除此項 </f7-button>
          </f7-col>
        </f7-grid>
      </div>
      <p class="date">更新日期: {{item.lastUpdate}}</p>
    </f7-block>
  </f7-page>
</template>

<script>
import DrawApp from '../components/draw.js';
import Utils from '../utils/utils';
import Loader from '../loader/loader';

export default {
  data: function () {
    return {
      editGraphic: false,
      inputChecked: false,
      colors: [
        {class:"white", code: "#FFF"},
        {class:"yellow", code: "#FFE400"},
        {class:"red", code: "#E30613"},
        {class:"blue", code: "#009FE3"},
        {class:"black", code: "#000"}
      ],
      selectedColor: "#009FE3"
    }
  },
  computed: {
    item () {
      let itemData = this.$store.state.editingData;
      this.inputChecked = itemData.textInfo.title !== '';
      this.selectedColor = this.$store.state.editingData.drawArray.color;
      return this.$store.state.editingData;
    },
    mode () {
      return this.$store.state.mode;
    },
    imageData (){
      return this.$store.state.imageData;
    },
    key (){
      return this.$store.state.currentItemKey;
    }, 
    projectId() {
      return this.$store.state.currentProjectId;
    }
  },
  methods:{
    startMoveBoard :function (event) {
      if (this.editGraphic === true) {
        let touchEvent = Utils.isMobileOrTablet() ? "touchmove" : "mousemove";
        window.addEventListener(touchEvent, this.boardMoving, true);
      }
    },
    endMoveBoard: function (event) {
      let touchEvent = Utils.isMobileOrTablet() ? "touchmove" : "mousemove";
      window.removeEventListener(touchEvent, this.boardMoving, true);
    },
    boardMoving: function (event) {
      if (this.editGraphic === true) {
        let eventY = Utils.isMobileOrTablet() ? event.touches[0].clientY : event.clientY;
        let eventX = Utils.isMobileOrTablet() ? event.touches[0].clientX : event.clientX;
        this.$refs.board.style.top = (eventY- this.$refs.board.clientHeight/2) + 'px';
        this.$refs.board.style.left = (eventX - this.$refs.board.clientWidth/2) + 'px';
      }
    },
    toggleEdit: function (event) {
      if (this.$refs.control.classList.contains('show')) {
        event.target.innerHTML = "編輯";
        this.editGraphic = false;
        this.draw.enablePant(false);
      } else {
        event.target.innerHTML = "取消";
        this.editGraphic = true;
        this.draw.enablePant(true);
      }
      this.$refs['edit-btn'].$el.classList.toggle('show');
      this.$refs.control.classList.toggle('show');
    },
    clean: function () {
      this.draw.clean();
    },
    chooseColor: function (color) {
      this.selectedColor = color;
      this.draw.setColor (color);
    },
    updateItem: function () {
      let itemData = {
        projectId: this.projectId,
        drawArray: this.draw.getDrawData(),
        boardlocation: {
          x: this.$refs.board.offsetLeft,
          y: this.$refs.board.offsetTop
        },
        lastUpdate: new Date ().getTime (),
        textInfo: this.item.textInfo
      };

      // if has new data
      if (this.imageData !== null) {
        itemData.imageUrl = 'images/' + new Date ().getTime () + '.jpg';
        let fileData = Utils.dataURItoBlob (this.imageData);
        Loader.addNewItem (itemData, fileData, this.backToProject.bind(this));
      } else {
        itemData.imageUrl = this.item.imageUrl;
        Loader.updateItem (this.key, itemData, this.updateFinished.bind(this));
      }
    },
    backToProject: function () {
      this.$router.loadPage('/project/'+ this.projectId);
    },
    deleteItem: function () {
      let key = this.key;
      this.$f7.confirm ('確定刪除' + name +'?',
          function (ok) {
              Loader.deleteItem (key, this.backToProject.bind(this));
          }
      );
    },
    updateFinished: function () {
        this.$refs.editText.innerHTML = "取消";
        this.editGraphic = false;
        this.draw.enablePant(false);
        this.$refs['edit-btn'].$el.classList.toggle('show');
        this.$refs.control.classList.toggle('show');
    },
    setImage (imageUrl, refName) {
      let that = this;
        Loader.getDownloadLink (imageUrl).then( url => {
          that.$refs[refName].src = url.toString();
        });  
      return 'db/img/loading.gif';
    }
  },
  mounted(){

    this.draw = new DrawApp ();
    
    if (this.mode === 'new' && this.key === 0) {
      this.editGraphic = true;
    } else {
      let draw = this.item.drawArray;
      let location = this.item.boardlocation;
      this.draw.setDrawing (draw.color, draw.clickX, draw.clickY, draw.clickDrag);
      this.$refs.board.style.top = location.y + 'px';
      this.$refs.board.style.left = location.x + 'px';
    }
  }
}
</script>