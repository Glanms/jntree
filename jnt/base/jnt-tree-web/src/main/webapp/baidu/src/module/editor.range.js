Minder.Range = kity.createClass('Range',{
    constructor : function(){
        this.nativeRange = document.createRange();
        this.nativeSel = window.getSelection();
    },
    hasNativeRange : function(){
        return this.nativeSel.rangeCount !== 0 ;
    },
    select:function(){
        var start = this.nativeRange.startContainer;
        if(start.nodeType == 1 && start.childNodes.length === 0){
            var char = document.createTextNode('\u200b');
            start.appendChild(char);
            this.nativeRange.setStart(char,1);
            this.nativeRange.collapse(true);
        }
        try{
            this.nativeSel.removeAllRanges();
        }catch(e){

        }

        this.nativeSel.addRange(this.nativeRange);
        return this;
    },
    setStart:function(node,index){
        try{
            this.nativeRange.setStart(node,index);
        }catch(error){
            console.log(error);
        }

        return this;
    },
    setEnd:function(node,index){
        this.nativeRange.setEnd(node,index);
        return this;
    },
    getStart:function(){
        var range = this.nativeSel.getRangeAt(0);
        return {
            startContainer:range.startContainer,
            startOffset:range.startOffset
        };
    },
    getStartOffset:function(){
        return this.nativeRange.startOffset;
    },
    getEndOffset:function(){
        return this.nativeRange.endOffset;
    },
    collapse:function(toStart){
        this.nativeRange.collapse(toStart === true);
        return this;
    },
    isCollapsed:function(){
        return this.nativeRange.collapsed;
    },
    insertNode:function(node){
        this.nativeRange.insertNode(node);
        return this;
    },
    updateNativeRange:function(){

        this.nativeRange = this.nativeSel.getRangeAt(0);
        return this;
    }

});