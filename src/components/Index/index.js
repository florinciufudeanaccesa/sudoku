import { h, Component } from 'preact';
import styles from './style.less';
import Countdown from '.././Countdown';
import services from '../.././services/services';
import firebase from 'firebase';

class Index extends Component {
	constructor (props) {
		super();
        this.props = props;
        this.state.lines = 0;
        this.state.initXX=[];
        this.state.currentXX=[];
        this.state.finishXX=[];
        this.state.challenge= this.props.challenge;
        this.state.gameStarted= true;
        this.state.colorXX= [];
        this.state.modalOpened= [];
        this.state.restart= true;
        this.state.numberOfClicks= 0;
        this.state.inputValue="";
        this.state.scoreSubmited=false;
    }

    componentDidMount(nextProps){
        this.initTable(this.state.challenge, this.state.gameStarted);
    }

    renderTable(){
        var box=[], tdrows=[], color, showModal, ceil, round, value, curent, i;
        
        if (!this.state.initXX[0]){
            return;
        }
        for (i = 1; i <= 81; i++) {
            ceil = Math.ceil(i/9) - 1;
            round = Math.round(i%9) - 1;
            if (round === -1) {round = 8}
            value = this.state.initXX[ceil][round];
            curent = this.state.currentXX[ceil][round];
            color = this.state.colorXX[ceil][round];
            if (!this.state.initXX[ceil][round]){
                this.state.initXX[ceil][round] = "";
            }

            showModal = false;
            if (this.state.modalOpened[i]){
                showModal = true;
            }
            if (value === undefined) {value = ""}
                if (this.state.initXX[ceil][round] == 0){
                    this.state.initXX[ceil][round] = '';
                }
            if (value && curent){
                tdrows.push(<td key={'box' + i} className={styles.box + ' ' + i} >{value}</td>);
            }else{
                tdrows.push(<td key={'box' + i} className={styles.box + ' ' + i + ' ' + color} ><div className={showModal ? styles.showModal : styles.hide}>{this.renderNumbers(ceil, round)}</div><input value={this.state.initXX[ceil][round]} onInput={this.handleChange.bind(this)} onClick={this.openOptions.bind(this, i)} className={styles.box + ' ' + i} max='9' min='0' maxLength="1"></input></td>);
            }

            if (i % 9 === 0){
                 box.push(<tr key={i}>{tdrows}</tr>);
                 tdrows=[];
            }
        }

        // this.state.data.map(function(item, i){
        //   console.log('test');
        //   return <li key={i}>Test</li>
        // })
        return box;
    }

    renderNumbers(ceil, round){
        return (
            <span>ceil  round</span>
        )
    }
    
    openOptions(index, elem){
        this.state.modalOpened= [];
        this.state.modalOpened[index] = true;
        this.setState({modalOpened : this.state.modalOpened});
    }

    handleChange(elem){
        var rowNumber = parseInt(elem.target.className.split(" ")[1]);
        var round = Math.round(rowNumber%9) - 1;
        if (round === -1) {round = 8}
        this.state.initXX[Math.ceil(rowNumber/9) - 1][round] = elem.target.value;

        var isFinish = true;
        for (var i=0; i <= 8; i++){
            for (var j=0; j <= 8; j++){
                if (this.state.initXX[i][j] != this.state.finishXX[i][j]){
                    isFinish = false;
                    this.state.colorXX[i][j] = "";
                }
            }
        }
        if (isFinish){
            this.setState({
                initXX: JSON.parse(JSON.stringify(this.state.finishXX)),
                currentXX: JSON.parse(JSON.stringify(this.state.finishXX)),
                gameStarted: false,
                gamefinished: true})
        }else{
            this.setState({
                initXX: this.state.initXX,
                colorXX: this.state.colorXX,
                gameStarted: false});
        }
    }

    initTable(challenge, gameStarted){
        var level;
        if (gameStarted){
            for (var i=0; i <= 8; i++){
                this.state.colorXX[i] = [];                    
            }
            this.getLevel(challenge);
        }
    }

    checkComplete() {
        var isRight = true;
        for (var i=0; i <= 8; i++){
            for (var j=0; j <= 8; j++){
                 if (this.state.initXX[i][j] && (this.state.initXX[i][j] != this.state.finishXX[i][j])){
                    isRight = false;
                    this.state.colorXX[i][j] = styles.red;
                 }else{
                    this.state.colorXX[i][j] = "";
                 }
            }
        }
        this.state.numberOfClicks++;
        this.setState({
            checkSolution: true,
            restart: false,
            numberOfClicks: this.state.numberOfClicks
        });
    }

    clearSolution() {
        var isRight = true;
        for (var i=0; i <= 8; i++){
            this.state.colorXX[i] = [];
        }
        this.state.initXX = JSON.parse(JSON.stringify(this.state.currentXX));
        this.setState({
            initXX: this.state.initXX,
            checkSolution: true,
            restart: false
        });
    }

    selectChallenge(e){
        this.initTable(e.target.value, true);
    }

    newGame(){
        this.initTable(this.state.challenge, true);
    }

    tick(seconds){
        this.state.seconds = seconds;
        this.state.restart = false;
    }

    back(){
        this.props.goBack(this.state.challenge);
    }

    renderCountDown() {
        var time = 1;
        return (
            <div className={styles.countWrapper}>
                <div onClick={this.toogleTime.bind(this)} className={this.state.showtime ? styles.countdown + " " + styles.showTime : styles.hide}>
                    <Countdown 
                        seconds={time}
                        onTick={this.tick.bind(this)}
                        restart={this.state.restart}
                        stop={this.state.gamefinished}/>
                </div>
                <button className={this.state.showtime ? styles.hide : styles.showButtonTime} onClick={this.toogleTime.bind(this)}>Time</button>
                <button className={styles.back} onClick={this.back.bind(this)}>Back</button>
            </div>
        )
    }

    toogleTime() {
        this.setState({
            showtime: !this.state.showtime,
            restart: false,
            checkSolution: true
        });
    }

    submitScore(){
        var that = this;
        FB.api('/me', function(response) {
            if (that.state.inputValue != ""){
                var databaseName = that.state.challenge.substring(0, that.state.challenge.length - 1);
                
                firebase.database().ref('Records/' + databaseName + '/').push({
                    Nume: that.state.inputValue,
                    Score: that.state.seconds,
                    fbId: response.id
                });
                that.setState({
                    scoreSubmited:true
                });
            }
        });
        var databaseName = that.state.challenge.substring(0, that.state.challenge.length - 1);
        FB.ui({
          method: 'share',
          hashtag: '#sudoku',
          href: 'https://www.facebook.com/sudoku.puzzle.game',
          quote: that.state.inputValue + ' finished sudoku level ' + databaseName + ' in time ' + services.showHoursMinutesSeconds(that.state.seconds),
        }, function(response){});
    }

    renderGameOver(){
        if (this.state.gamefinished){
            return(
                <div className={styles.gameover}>
                    <div className={styles.rect}>
                        <p>Bravo</p>
                        <button className={styles.newButton} onClick={this.newGame.bind(this)}>New game</button>
                        {this.toggleNameScore()}
                        <p>{this.state.scoreSubmited ? '' : services.showHoursMinutesSeconds(this.state.seconds)}</p>
                    </div>
                </div>
            )
        }
    }

    toggleNameScore(){
        if (this.state.scoreSubmited){
            return(
                <label className={styles.yourTime}>
                    <span>{this.state.inputValue}</span> 
                    {", your time is " + services.showHoursMinutesSeconds(this.state.seconds)}
                </label>
            )
        }else{
            return(
                <div className={styles.inputName}>
                    <label>Name:</label><input type="text" maxLength="24" name="FirstName" value={this.state.inputValue} placeholder="Your Name" onChange={this.updateInputValue.bind(this)}/><button onClick={this.submitScore.bind(this)}>Submit score</button>
                </div>
            )
        }
    }

    updateInputValue(evt){
        this.setState({
          inputValue: evt.target.value
        });
    }

    displayCheckSolution(){
        if (this.state.numberOfClicks < 3){
            return (
                <button onClick={this.checkComplete.bind(this)}>Check solution</button>
            )
        }else{
            return(
                <div></div>
            )
        }
    }

    render({ level, id }) {
        return (
            <div className={styles.middleTable}>
                <div className={styles.options}>
                    {this.renderCountDown()}
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
                    <button className={styles.clear} onClick={this.clearSolution.bind(this)}>Clear</button>
                    <button className={(this.state.numberOfClicks < 3) ? styles.clear : styles.invisible} onClick={this.checkComplete.bind(this)}>{"Check solution " + (3 - this.state.numberOfClicks)}</button>
                </div>
                <table className={styles.tableField}> 
                    {this.renderTable()}
                </table>
                {this.renderGameOver()}
            </div>
        );
    }

    getLevel(challenge){
        var testjson1,testjson2;
        var rand = Math.round(Math.random()*21);
        var starCountRef = firebase.database().ref('/Data/' + challenge + "/" + rand);

        starCountRef.on('value', function(snapshot) {
            testjson1 = JSON.parse("[" + snapshot.val()[0] + "]");
            testjson2 = JSON.parse("[" + snapshot.val()[1] + "]");

            this.state.initXX = JSON.parse(JSON.stringify(testjson1));
            this.state.currentXX = JSON.parse(JSON.stringify(testjson1));
            this.state.finishXX = JSON.parse(JSON.stringify(testjson2));

            this.setState({
                challenge: challenge,
                gameStarted: true,
                initXX: this.state.initXX,
                currentXX: this.state.currentXX,
                finishXX: this.state.finishXX,
                restart: true,
                gamefinished: false,
                numberOfClicks: 0,
                inputValue:'',
                scoreSubmited:false
            });
        }, this);
    }
}
export default Index;