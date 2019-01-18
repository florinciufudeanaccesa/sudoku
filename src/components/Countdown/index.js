import { h, Component } from 'preact';
import styles from './style.less';
import services from '../.././services/services';

class Countdown extends Component {
	constructor (props){        
        super();
        this.props = props;
        this.componentWillReceiveProps(this.props);
        // set initial time:
        this.state.seconds = this.props.seconds || 0;
        this.state.stop = this.props.stop || '';
    }
    componentWillReceiveProps (nextProps){
        if (nextProps.restart) {
            clearTimeout(this.timer);
            this.setState({seconds: nextProps.seconds});
            this.tick(nextProps.seconds);
        }
        if (nextProps.stop){
            clearTimeout(this.timer);
        }
        return true;
    }
    tick (seconds){
        var that = this;

        this.timer = setTimeout(function(){
            if (!that.state.stop) {
                seconds++;
                that.setState({seconds: seconds});
            }
            if (seconds > 0) {
                that.tick(seconds);
                that.props.onTick(seconds);
            }else{
                that.props.tick(seconds);
            }
        }, 1000);
    }
    render () {
        return (
            <span className={styles.showRemainingTime}>{services.showHoursMinutesSeconds(this.state.seconds)}</span>
        );
    }    
}

export default Countdown;
