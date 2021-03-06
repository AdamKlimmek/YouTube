import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSpinner, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import NavBarContainer from '../navbar/navbar_container';
import SideMenuContainer from '../sidemenu/side_menu_container'
import VideoShowIndexItem from './video_show_index_item';
import CommentIndexContainer from '../comments/comment_index_container';

class VideoShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            likesCount: 0,
            dislikesCount: 0,
        }

        this.handleLike = this.handleLike.bind(this);
        this.handleDislike = this.handleDislike.bind(this);
        this.handleVideoEnded = this.handleVideoEnded.bind(this);
    }

    componentDidMount() {
        this.props.toggleShowPage();
        this.props.fetchVideo(this.props.match.params.videoId).then(() => this.setLikes());
        this.props.fetchVideos();
        window.scrollTo(0, 0);
    }

    componentDidUpdate(oldProps) {
        if (oldProps.video && oldProps.video.id != this.props.match.params.videoId) {
            this.props.fetchVideo(this.props.match.params.videoId).then(() => this.setLikes());
            window.scrollTo(0, 0);
        }
    }

    componentWillUnmount() {
        this.props.toggleShowPage();
    }

    setLikes() {
        this.setState({ likesCount: this.props.video.likesCount, dislikesCount: this.props.video.dislikesCount})
    }

    handleLike() {
        if (!this.props.currentUser) this.props.history.push('/signin');

        if (this.state.updating) return;

        this.setState({ updating: true })
        let currLikes = this.state.likesCount;
        let currDislikes = this.state.dislikesCount;

        if (Object.keys(this.props.currentUserLike).length === 0) {
            this.props.postLike({
                video_id: this.props.video.id,
                liked: true
            })
            .then(() => this.setState({ likesCount: currLikes + 1, updating: false }));
        } else {
            if (this.props.currentUserLike.liked) {
                this.props.deleteLike(this.props.currentUserLike.id)
                .then(() => this.setState({ likesCount: currLikes - 1, updating: false }));
            } else {
                this.props.patchLike({
                    id: this.props.currentUserLike.id,
                    video_id: this.props.video.id,
                    liked: true
                })
                .then(() => this.setState({ likesCount: currLikes + 1, dislikesCount: currDislikes - 1, updating: false }));
            }
        }
    }

    handleDislike() {
        if (!this.props.currentUser) this.props.history.push('/signin');

        if (this.state.updating) return;
        
        this.setState({ updating: true })
        let currLikes = this.state.likesCount;
        let currDislikes = this.state.dislikesCount;

        if (Object.keys(this.props.currentUserLike).length === 0) {
            this.props.postLike({
                video_id: this.props.video.id,
                liked: false
            })
            .then(() => this.setState({ dislikesCount: currDislikes + 1, updating: false }));
        } else {
            if (!this.props.currentUserLike.liked) {
                this.props.deleteLike(this.props.currentUserLike.id)
                .then(() => this.setState({ dislikesCount: currDislikes - 1, updating: false }));
            } else {
                this.props.patchLike({
                    id: this.props.currentUserLike.id,
                    video_id: this.props.video.id,
                    liked: false
                })
                .then(() => this.setState({ likesCount: currLikes - 1, dislikesCount: currDislikes + 1, updating: false }));
            }
        }
    }
    
    handleVideoEnded() {
        this.props.patchVideoViews({
            views: this.props.video.views + 1,
            id: this.props.video.id
        });

        this.props.history.push(`/videos/${this.props.videosArray[0].id}`);
    }

    render() {
        const { video, currentUser, currentUserLike, videosArray } = this.props;

        if (!video) return null;

        let editButton;
        if (currentUser && currentUser.id === video.uploader_id) {
            editButton = <Link to={`/videos/${video.id}/edit`}>
                <button className="video-edit-button">Edit</button>
            </Link>
        } else {
            editButton = <div></div>
        }

        let thumbsUpActivity = "";
        let thumbsDownActivity = "";
        if (!currentUser) {
            thumbsUpActivity = "";
            thumbsDownActivity = "";
        } else {
            if (currentUserLike.liked !== undefined) {
                if (currentUserLike.liked) {
                    thumbsUpActivity = "active";
                    thumbsDownActivity = "";
                } else {
                    thumbsUpActivity = "";
                    thumbsDownActivity = "active";
                }
            }
        }

        const videoShowIndex = () => {
            return <div className="video-show-index">
                {videosArray.map(video => (
                    <VideoShowIndexItem video={video} key={video.id} />
                ))}
            </div>
        }

        return (
            <div className="video-show">
                <NavBarContainer />

                <SideMenuContainer />

                <div className="video-show-content">
                    <div className="video-show-left-col">
                        <video className="video-player"
                            src={video.videoURL}
                            controls
                            height="500"
                            width="900"
                            autoPlay
                            onEnded={this.handleVideoEnded}
                        ></video>

                        <div className="video-show-details">
                            <div className="video-show-details-top">
                                <div className="video-title-edit">
                                    <div className="video-title">{video.title}</div>
                                    {editButton}
                                </div>

                                <div className="video-stats">
                                    <div className="video-left-stats">
                                        <div className="video-views">{video.views} Views</div>
                                        <FontAwesomeIcon icon={faCircle} className="video-circle-divider" />
                                        <div className="video-creation-date">{video.creationDate}</div>
                                    </div>
                                    
                                    <div className="video-likes">
                                        <button onClick={this.handleLike} disabled={this.state.updating}>
                                            <FontAwesomeIcon icon={faThumbsUp} className={`video-thumbs-up ${thumbsUpActivity}`}/>
                                        </button>
                                        <span>{this.state.likesCount}</span>

                                        <button onClick={this.handleDislike} disabled={this.state.updating}>
                                            <FontAwesomeIcon icon={faThumbsDown} className={`video-thumbs-down ${thumbsDownActivity}`}/>
                                        </button>
                                        <span>{this.state.dislikesCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="video-show-details-bottom">
                                <div className="video-uploader-info">
                                    <div className={`video-uploader-icon ${video.uploaderColor}`}>{video.uploader[0].toUpperCase()}</div>
                                    <div className="video-uploader-username">{video.uploader}</div>
                                </div>
                                
                                <div className="video-description">{video.description}</div>
                            </div>

                            <CommentIndexContainer video={video} />
                        </div>
                    </div>

                    <div className="video-show-right-col">
                        <div className="video-show-index-up-next">Up Next</div>

                        {videoShowIndex()}
                    </div>
                    
                </div>
            </div>
        )
    }
};

export default withRouter(VideoShow);
