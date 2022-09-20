import classNames from 'classnames';
import React  from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import  styles from './DraggableWindowComponent.css';

import PropTypes from 'prop-types';
import { ItemTypes } from './drag_constants';
import { DragSource } from 'react-dnd';

import {ActionDropDraggableWindow }  from './actions/sensor_actions';

const DraggableWindowSource = {
  beginDrag(props) {
    return {

          element_type: ItemTypes.DRAGGABLE_WINDOW,
          draggableWindowId: props.draggableWindowId
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class DraggableWindowComponent extends Component {


  componentDidMount () {

      //  this.props.onCreateDraggableWindow(this.props.draggableWindowId);

      if (typeof(this.props.initialCoords) != 'undefined'){

        let  top   =  this.props.initialCoords[1];
        let  left  =  this.props.initialCoords[0];

         this.props.onCreateDraggableWindow(top,left,this.props.draggableWindowId);


      }


  }


  render(){



     const { connectDragSource, isDragging} = this.props;

      var draggable_window_id =  this.props.draggableWindowId;

      var top   = 200;
      var left  =  200;
      var isShowing =  false;



      if (typeof(this.props.draggable_window[draggable_window_id]) != 'undefined'){

         top   =  this.props.draggable_window[draggable_window_id].position_top;
         left  =  this.props.draggable_window[draggable_window_id].position_left;
         isShowing =  this.props.draggable_window[draggable_window_id].isShowing;

      }





          return connectDragSource(

                  <div    className={classNames(

                                {[styles.draggable_window]: true},
                                {[styles.window_show]: isShowing},
                                {[styles.window_hide]: !isShowing},

                                )}

                          style={{

                                position: 'fixed',
                                top: `${top}px`,
                                left: `${left}px`,
                                }}

                          id={`draggable_window_id-${this.props.draggableWindowId}`}>


                      {this.props.children}


                      </div>



             )

        }


    }


    const mapStateToProps =  state => ({


    draggable_window:state.scratchGui.draggable_window


      });

    const mapDispatchToProps = dispatch => ({


      // onCreateDraggableWindow: (draggable_window_id) => {
      //
      //     dispatch(ActionCreateDraggableWindow(draggable_window_id));
      //   }

      onCreateDraggableWindow: (top,left, draggable_window_id) => {

            dispatch(ActionDropDraggableWindow(top,left, draggable_window_id));
          }


    });

    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(DragSource(ItemTypes.DRAGGABLE_WINDOW, DraggableWindowSource, collect)(DraggableWindowComponent));
