import { h, Component } from 'preact';
import FirstPage from '.././FirstPage';
import styles from './style.less';
import { Link } from 'preact-router';
export default class Home extends Component {

	inviteFriends(){
		FB.ui({method: 'apprequests',
	      message: 'Play Sudoku, a general knowledge game'
	    }, function(response){
	    });
	}

	render() {
		return (
        	<div className={styles.wrapper + ' ' + styles.noselect}>
    
	        	<FirstPage/>
        		<button className={styles.facebookshare} onClick={this.inviteFriends}>Invite friends</button>
                <div className={styles.fblike}>
                    <div class="fb-like" data-href="https://www.facebook.com/sudoku.puzzle.game/" data-layout="button_count" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div>
                </div>
            </div>
        )
	}
};
