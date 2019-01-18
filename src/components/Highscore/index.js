import { h, Component } from 'preact';
import styles from './style.less';
import services from '../.././services/services';
import firebase from 'firebase';

class Highscore extends Component {
	constructor (props) {
		super();
		this.props = props;
        this.state.allData = [];
        this.state.displayedData = [];
        this.state.challenge = 'Easy1';
        this.state.isPlaying = false;
        this.state.showHighscores = false;
        this.state.level = 'Easy';
        this.state.inputSearchValue = '';
    }

    componentDidMount (nextProps){
        var starCountRef = firebase.database().ref('/Records/');
        starCountRef.on('value', function(snapshot) {
            var testjson1 = snapshot.val();
            if (testjson1){
                this.setState({
                    allData: testjson1,
                    displayedData: testjson1["Easy"]
                });
            }
        }, this);
    }

    levelClick(level){
        this.setState({
            level:level,
            displayedData:this.state.allData[level]
        });
    }

    sortBytitle (a, b) {
        return ((a.Score < b.Score) ? -1 : ((a.Score > b.Score) ? 1 : 0));
    }
    
    renderTable(){
        var i = 0, 
            data=[];
        for (var elem in this.state.displayedData){
            if (this.state.inputSearchValue === ''){
                data.push(this.state.displayedData[elem]);
            }else if (this.state.displayedData[elem].Nume.toLowerCase().includes(this.state.inputSearchValue.toLowerCase())){
                data.push(this.state.displayedData[elem]);
            }
        }
        let orderedData = data.sort(this.sortBytitle);
        let persons = [];
        let rows = orderedData.map(person => {
            i++;
            if (person.fbId){persons.push(person.fbId)}

            person.Place = i;
            let imgSrc = "https://graph.facebook.com/" + person.fbId + "/picture?type=square";
            return <tr>
                <td>
                    { person.Place + '.' }
                </td>
                <td>
                    <img src={imgSrc} alt='' width="32" height="32"/>
                    <span> {person.Nume}</span>
                </td>
                <td>
                    { services.showHoursMinutesSeconds(person.Score) }
                </td>
            </tr>
        })

        return ( 
            <table className={styles.highscoreTable}>
                <thead>
                    <tr>
                         <th>Nr.</th>
                         <th>Name</th>
                         <th>Time</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }

    back(){
        this.props.goBack("Easy1");
    }

    updateSearchValue(evt){
        this.setState({
          inputSearchValue: evt.target.value
        });
    }

    render() {
    	return (
            <div className={styles.highscore}>
                <button className={styles.back} onClick={this.back.bind(this)}>Back</button>
                
                <div className={styles.tableDisplay}>
                    <label>Search</label><input type="text" maxLength="24" name="name" value={this.state.inputSearchValue} placeholder="name" onInput={this.updateSearchValue.bind(this)}/>
                    <div className={styles.levels}>
                        <span onClick={this.levelClick.bind(this,'Easy')} className={styles.level + " " + styles['easy' + this.state.level]}>Easy</span>
                        <span onClick={this.levelClick.bind(this,'Normal')} className={styles.level + " " + styles['normal' + this.state.level]}>Normal</span>
                        <span onClick={this.levelClick.bind(this,'Hard')} className={styles.level + " " + styles['hard' + this.state.level]}>Hard</span>
                        <span onClick={this.levelClick.bind(this,'Pro')} className={styles.level + " " + styles['pro' + this.state.level]}>Pro</span>
                    </div>
                    <div className={styles.tableBody}>
                        {this.renderTable()}
                    </div>    
                </div>
            </div>
        )
    }

}
export default Highscore;