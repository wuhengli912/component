<template>
  <div>
    <div class="movebox" ref="movebox" :style="{ width, height }">
      <div
        class="movego"
        :style="{ backgroundColor: slidebgcolor }"
        ref="movego"
      ></div>
      <div class="txt" id="txt" :style="{ backgroundColor: bgcolor }">
        <span ref="text"> 拖动滑块验证 </span>
      </div>
      <div class="move moveBefore" ref="move" @mousedown="dragslide"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      success: false,
    };
  },
  props: {
    width: {
      type: [String, Number],
      default: "300px",
    },
    height: {
      type: [String, Number],
      default: "48px",
    },
    bgcolor: String,
    slidebgcolor: String,
  },
  methods: {
    dragslide(e) {
      //1.鼠标按下之前必须清除掉后面设置的过渡属性
      if (this.success) return;
      this.$refs.move.style.transition = "";
      this.$refs.movebox.style.transition = "";
      this.$refs.movego.style.transition = "";
      let distance =
        this.$refs.movebox.offsetWidth - this.$refs.move.offsetWidth;
      //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。
      //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
      var e = e || window.event;
      var downX = e.clientX;

      //三、给文档注册鼠标移动事件
      document.onmousemove = (e) => {
        var e = e || window.event;
        //1.获取鼠标移动后的水平位置
        var moveX = e.clientX;

        //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
        var offsetX = moveX - downX;

        //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
        if (offsetX > distance) {
          offsetX = distance; //如果滑过了终点，就将它停留在终点位置
        } else if (offsetX < 0) {
          offsetX = 0; //如果滑到了起点的左侧，就将它重置为起点位置
        }

        //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
        this.$refs.move.style.left = offsetX + "px";
        this.$refs.movego.style.width = offsetX + "px";

        //如果鼠标的水平移动距离 = 滑动成功的宽度
        if (offsetX == distance) {
          //1.设置滑动成功后的样式
          this.$refs.text.innerHTML = "验证通过";
          this.$refs.text.style.color = "#fff";
          this.$refs.move.className = "move moveSuccess";
          this.$refs.movebox.style.backgroundColor = "#0186be";

          //2.设置滑动成功后的状态
          this.success = true;
          //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
          this.$refs.move.onmousedown = null;
          document.onmousemove = null;
          //成功后，给父组件返回true
          this.$emit("isvalidate", this.success);
        }
      };

      //四、给文档注册鼠标松开事件
      document.onmouseup = (e) => {
        //如果鼠标松开时，滑到了终点，则验证通过
        if (this.success) {
          return;
        } else {
          //反之，则将滑块复位（设置了1s的属性过渡效果）
          this.$refs.move.style.left = 0;
          this.$refs.movego.style.width = 0;
          // this.$refs.movebox.style.width = 0;
          this.$refs.move.style.transition = "left 1s ease";
          this.$refs.movego.style.transition = "width 1s ease";
          this.$refs.movebox.style.transition = "width 1s ease";
        }
        //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
};
</script>

<style lang="less" scoped>
.movebox {
  position: relative;
  background-color: #e8e8e8;
  width: 300px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  // border-radius: 2px;
  box-shadow: none;
  .txt {
    position: absolute;
    top: 0px;
    background-color: #00c6ff1a;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
  }
  .movego {
    background-color: #017fb7;
    height: 100%;
    width: 0px;
  }
  .move {
    box-sizing: border-box;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 52px;
    height: 100%;
    border: 1px solid #ccc;
    cursor: move;
    overflow: hidden;
  }

  .moveBefore {
    background: #fff
      url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")
      no-repeat center;
  }
  .moveSuccess {
    background: #fff
      url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")
      no-repeat center;
  }
}
</style>