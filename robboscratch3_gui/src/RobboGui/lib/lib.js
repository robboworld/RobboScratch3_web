
const draggable_window_ids = {};

const immutable_copy = function(data_structure_element){

  if (Array.isArray(data_structure_element)){

    let buf_arr = [];

        data_structure_element.forEach(function(item,index){

                buf_arr[index] = immutable_copy(item);

        });

      return buf_arr;


  }else if (typeof (data_structure_element) == 'object'){



        let buf_object = {};

        for (var property in data_structure_element) {
        if (data_structure_element.hasOwnProperty(property)) {

              //if ((typeof(property) != 'array') || (typeof(property) != 'object')){

                Object.defineProperty(buf_object, property, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: immutable_copy(data_structure_element[property])
                    });


        }
    }

    return buf_object;

  }else{

      let buf;

      buf = data_structure_element;

      return buf;

  }


}

const color_filter = function(filter_color_table){



}


const color_corrector = function(rgb_array){








}

function setProps (object, props) {
    for (var i in props) {
        object[i] = props[i];
    }
}

const createDivShort = function (parent,styles,inner_content,attributes) {
    var el = document.createElement('div');
   
    setProps(el.style, styles);

 if (inner_content)
    el.innerHTML = inner_content;

     for (let attr in attributes){

      el.setAttribute(attr, attributes[attr])
    }

    parent.appendChild(el);
    return el;
}

const createDiv = function (parent, x, y, w, h, styles,inner_content,attributes) {
    var el = document.createElement('div');
    // el.style.position = 'absolute';
    // el.style.top = y + 'px';
    // el.style.left = x + 'px';
    // if (w) {
    //     el.style.width = w + 'px';
    // }
    // if (h) {
    //     el.style.height = h + 'px';
    // }
    setProps(el.style, styles);

 if (inner_content)
    el.innerHTML = inner_content;

     for (let attr in attributes){

      el.setAttribute(attr, attributes[attr])
    }

    parent.appendChild(el);
    return el;
}

const generateDraggableWindowId = function(){


}

const getDraggableWindowIdByName = function(){


}

export {

    immutable_copy,
    color_filter,
    color_corrector,
    createDiv,
    createDivShort
};
