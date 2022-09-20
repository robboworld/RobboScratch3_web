import React from 'react';
import PropTypes from 'prop-types';
import {intlShape, injectIntl} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

import {setProjectUnchanged} from '../reducers/project-changed';
import {
    LoadingStates,
    getIsCreatingNew,
    getIsFetchingWithId,
    getIsLoading,
    getIsShowingProject,
    onFetchedProjectData,
    projectError,
    setProjectId
} from '../reducers/project-state';
import {
    activateTab,
    BLOCKS_TAB_INDEX
} from '../reducers/editor-tab';

import log from './log';
import storage from './storage';

const validate = require('scratch-parser');

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectFetcherHOC = function (WrappedComponent) {
    class ProjectFetcherComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'fetchProject'
            ]);
            storage.setProjectHost(props.projectHost);
            storage.setAssetHost(props.assetHost);
            storage.setTranslatorFunction(props.intl.formatMessage);
            // props.projectId might be unset, in which case we use our default;
            // or it may be set by an even higher HOC, and passed to us.
            // Either way, we now know what the initial projectId should be, so
            // set it in the redux store.
            if (
                props.projectId !== '' &&
                props.projectId !== null &&
                typeof props.projectId !== 'undefined'
            ) {
                this.props.setProjectId(props.projectId.toString());
            }
        }
        componentDidUpdate (prevProps) {
            if (prevProps.projectHost !== this.props.projectHost) {
                storage.setProjectHost(this.props.projectHost);
            }
            if (prevProps.assetHost !== this.props.assetHost) {
                storage.setAssetHost(this.props.assetHost);
            }
            if (this.props.isFetchingWithId && !prevProps.isFetchingWithId) {
                this.fetchProject(this.props.reduxProjectId, this.props.loadingState);
            }
            if (this.props.isShowingProject && !prevProps.isShowingProject) {
                this.props.onProjectUnchanged();
            }
            if (this.props.isShowingProject && (prevProps.isLoadingProject || prevProps.isCreatingNew)) {
                this.props.onActivateTab(BLOCKS_TAB_INDEX);
            }
        }


        validateProject(input){

        if (typeof input === 'object' && !(input instanceof ArrayBuffer) &&
          !ArrayBuffer.isView(input)) {
            // If the input is an object and not any ArrayBuffer
            // or an ArrayBuffer view (this includes all typed arrays and DataViews)
            // turn the object into a JSON string, because we suspect
            // this is a project.json as an object
            // validate expects a string or buffer as input
            // TODO not sure if we need to check that it also isn't a data view
            input = JSON.stringify(input);
        }

        const validationPromise = new Promise((resolve, reject) => {
            // The second argument of false below indicates to the validator that the
            // input should be parsed/validated as an entire project (and not a single sprite)
            validate(input, false, (error, res) => {
                if (error) return reject(error);
                resolve(res);
            });
        });

        return validationPromise
            .then(result => {return Promise.resolve(input)})
            .catch(error => {
                // Intentionally rejecting here (want errors to be handled by caller)
                if (error.hasOwnProperty('validationError')) {
                    return Promise.reject(JSON.stringify(error));
                }
                return Promise.reject(error);
            });

      }


      checkLocallySavedProject(){

            return new Promise((resolve,reject)=>{

              function errorHandler(e){
                console.error("File error during checkLocallySavedProject: " + e);

                 let res = {};

                res.file_exists = false;
                res.file = null;
                res.err = e;

                resolve(res);

              };

              function onInitFs(fs) {
                 console.log('Opened file system: ' + fs.name);


                 fs.root.getFile("auto-saved" + "." + "sb3", {create: false}, function(fileEntry) {

                   fileEntry.file(function(file) {
                        var reader = new FileReader();

                        reader.onloadend = function(e) {

                          if ((typeof (this) !== 'undefined') && (typeof(this.result) !== 'undefined')  && (this.result !== null)){


                            console.log("Read completed for " + "auto-saved" + "." + "sb3" + ". length=" + this.result.length);

                            let res = {};
                            res.file_exists = true;
                            res.file = this.result;
                            res.err = null;

                            resolve(res);


                          }else{

                            let res = {};

                            res.file_exists = false;
                            res.file = null;
                            res.err = e;

                            resolve(res);


                          }


                        };

                        reader.readAsArrayBuffer(file);
                     });


                 }, function(e){

                   let res = {};

                   res.file_exists = false;
                   res.file = null;
                   res.err = e;

                   resolve(res);

                 });
              };


              //window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
              //window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
              navigator.webkitPersistentStorage.requestQuota(500*1024*1024,
                 function(grantedBytes){
                    console.log("checkLocallySavedProject byte granted=" + grantedBytes);
                    window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
                 }, errorHandler
              );

            //   window.webkitRequestFileSystem(window.PERSISTENT, 50*1024*1024, onInitFs, errorHandler);

            });

    }


        fetchProject (projectId, loadingState) {
            // return storage
            //     .load(storage.AssetType.Project, projectId, storage.DataFormat.JSON)
            //     .then(projectAsset => {
            //         if (projectAsset) {
            //             this.props.onFetchedProjectData(projectAsset.data, loadingState);
            //         } else {
            //             // Treat failure to load as an error
            //             // Throw to be caught by catch later on
            //             throw new Error('Could not find project');
            //         }
            //     })
            //     .catch(err => {
            //         this.props.onError(err);
            //         log.error(err);
            //     });


          this.checkLocallySavedProject().then((result) => {


          if (result.file_exists){

           this.validateProject(result.file)

           .then((file) => {

             this.props.onFetchedProjectData(file, loadingState);

           })

           .catch(error => {

             storage
                 .load(storage.AssetType.Project, projectId, storage.DataFormat.JSON)
                 .then(projectAsset => {
                     if (projectAsset) {
                         this.props.onFetchedProjectData(projectAsset.data, loadingState);
                     } 
                 })

               //  .catch(err => log.error(err));
               .catch(err => console.error("Project load error: " + err));

           });

         }else {
           storage
               .load(storage.AssetType.Project, projectId, storage.DataFormat.JSON)
               .then(projectAsset => {
                   if (projectAsset) {
                       this.props.onFetchedProjectData(projectAsset.data, loadingState);
                   }
               })

             //  .catch(err => log.error(err));
             .catch(err => console.error("Project load error: " + err));
         }


              });

        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                assetHost,
                intl,
                isLoadingProject: isLoadingProjectProp,
                loadingState,
                onActivateTab,
                onError: onErrorProp,
                onFetchedProjectData: onFetchedProjectDataProp,
                onProjectUnchanged,
                projectHost,
                projectId,
                reduxProjectId,
                setProjectId: setProjectIdProp,
                /* eslint-enable no-unused-vars */
                isFetchingWithId: isFetchingWithIdProp,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    fetchingProject={isFetchingWithIdProp}
                    {...componentProps}
                />
            );
        }
    }
    ProjectFetcherComponent.propTypes = {
        assetHost: PropTypes.string,
        canSave: PropTypes.bool,
        intl: intlShape.isRequired,
        isFetchingWithId: PropTypes.bool,
        isLoadingProject: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onActivateTab: PropTypes.func,
        onError: PropTypes.func,
        onFetchedProjectData: PropTypes.func,
        onProjectUnchanged: PropTypes.func,
        projectHost: PropTypes.string,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        setProjectId: PropTypes.func
    };
    ProjectFetcherComponent.defaultProps = {
        assetHost: 'https://assets.scratch.mit.edu',
        projectHost: 'https://projects.scratch.mit.edu'
    };

    const mapStateToProps = state => ({
        isCreatingNew: getIsCreatingNew(state.scratchGui.projectState.loadingState),
        isFetchingWithId: getIsFetchingWithId(state.scratchGui.projectState.loadingState),
        isLoadingProject: getIsLoading(state.scratchGui.projectState.loadingState),
        isShowingProject: getIsShowingProject(state.scratchGui.projectState.loadingState),
        loadingState: state.scratchGui.projectState.loadingState,
        reduxProjectId: state.scratchGui.projectState.projectId
    });
    const mapDispatchToProps = dispatch => ({
        onActivateTab: tab => dispatch(activateTab(tab)),
        onError: error => dispatch(projectError(error)),
        onFetchedProjectData: (projectData, loadingState) =>
            dispatch(onFetchedProjectData(projectData, loadingState)),
        setProjectId: projectId => dispatch(setProjectId(projectId)),
        onProjectUnchanged: () => dispatch(setProjectUnchanged())
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(ProjectFetcherComponent));
};

export {
    ProjectFetcherHOC as default
};
