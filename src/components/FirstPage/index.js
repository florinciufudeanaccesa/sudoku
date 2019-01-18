import { h, render, Component } from 'preact';
import styles from './style.less';
import Highscore from '.././HighScore';
import Index from '.././Index';

class FirstPage extends Component {
	constructor() {
        super();
        this.state.challenge = 'Easy1';
        this.state.isPlaying = false;
        this.state.showHighscores = false;
    }

	selectChallenge(e){
        this.setState({challenge: e.target.value});
    }

    play(e){
    	this.setState({isPlaying:true});
    }

    goBack(challenge){
        if (!challenge){
            challenge = this.state.challenge;
        }
    	this.setState({
    		isPlaying:false,
    		showHighscores:false,
            challenge: challenge
    	});
    }

    getHighscores(e){
    	this.setState({showHighscores: true});
    }

    displayMenu(){        	
    	if (this.state.showHighscores){
    		return (
        		<Highscore
    				goBack={this.goBack.bind(this)}
    			/>
			)
    	}else if (this.state.isPlaying){
    		return (
    			<Index
                    path={"/" + this.state.challenge}
    				challenge={this.state.challenge}
    				goBack={this.goBack.bind(this)}
    			/>
			)
    	}else {
        	return (
        		<div className={styles.menu}>
	        		<button onClick={this.play.bind(this)}>Play game</button>
	        		<button onClick={this.getHighscores.bind(this)}>Highscores</button>
	        		<select onChange={this.selectChallenge.bind(this)} defaultValue={this.state.challenge} value={this.state.challenge}>
                        <option value="Easy1">Easy 1</option>
                        <option value="Easy2">Easy 2</option>
                        <option value="Easy3">Easy 3</option>
                        <option value="Normal1">Normal 1</option>
                        <option value="Normal2">Normal 2</option>
                        <option value="Normal3">Normal 3</option>
                        <option value="Hard1">Hard 1</option>
                        <option value="Hard2">Hard 2</option>
                        <option value="Hard3">Hard 3</option>
                        <option value="Pro1">Pro</option>
                        <option value="Pro2">Super Pro</option>
                    </select>
	            </div>
            )
        }
    }
    
    render(props,state) {
    	return (
    		<div>
        		{this.displayMenu()}
        	</div>
        )
    }
}

export default FirstPage;