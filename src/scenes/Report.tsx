import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Text,
  View,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { Actions } from 'react-native-router-flux'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import { Button, CheckBox } from 'react-native-elements'
import { foodsaver } from '../common/placeholder'
import report from '../common/report'
import { translate, pickTranslation } from '../common/translation'

import ReportPicker from '../components/ReportPicker'

const { width } = Dimensions.get('window')
    , styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.white
      },
      category: {
        fontWeight: 'bold',
        fontSize: 12,
        width,
        marginTop: 20,
        paddingLeft: 20
      },
      message: {
        flex: 1,
        fontSize: 14,
        padding: 12,
        paddingTop: 12,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.gray,
        margin: 10,
        textAlignVertical: 'top'
      }
    })

type Props = {
  id: number

  actions: any
  foodsavers: any
  isFocused: boolean
}

class Report extends PureComponent<Props> {
  state = {
    reason: report[1],
    selected: [],
    message: '',
    subreason: null,
    onlyText: false
  }
  backHandler: any

  dismiss = () =>
    this.setState({onlyText: false}, () => Keyboard.dismiss())

  interceptBackButton = () => {
    const { onlyText } = this.state
    if (!onlyText)
      return false

    this.dismiss()
    return true
  }

  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('report', id)
  }

  componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('report', id)

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.interceptBackButton)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  send = () => {
    const { reason, selected, subreason, message } = this.state
        , { actions, id } = this.props
        , reasons = [reason.de]

    selected.forEach(index => reasons.push(reason.children[index].de))

    if (subreason)
      reasons.push(reason.children.find(r => r.children).children[subreason].de)

    actions.makeReport(id, reason.id, reasons.join(' => '), message)

    Actions.pop()
  }

  render() {
    const { foodsavers, id } = this.props
        , { reason, subreason, onlyText, selected, message } = this.state
        , profile = foodsaver(foodsavers[id])

    return (
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        enabled
        style={{flex: 1}}
      >
        <SafeAreaView style={styles.container}>
          {!onlyText && <ReportPicker
            label={translate('report.why_do_you_want', {name: profile.name})}
            selected={reason && reason.id}
            onChange={({}, index) => this.setState({
              reason: report[index],
              selected: [],
              subreason: index === 2 ? 1 : null
            })}
            reasons={report}
          />}

          {!onlyText && reason && reason.children && reason.children.length &&
            <View style={{marginTop: 20}}>
              {reason.children.map((option, index) =>
                option.children && option.children.length > 0 ?
                  <ReportPicker
                    key={'subreason' + option.id}
                    selected={option.children[subreason].id}
                    onChange={({}, index) => this.setState({subreason: index})}
                    reasons={option.children}
                  /> :
                  <CheckBox
                    key={'subreason' + option.id}
                    title={pickTranslation(option)}
                    checkedColor={colors.green}
                    checked={selected.includes(index)}
                    onPress={() => this.setState({selected: selected.includes(index) ? selected.filter(o => o !== index) : selected.concat(index)})}
                    wrapperStyle={{margin: 0, padding: 0}}
                    textStyle={{fontSize: 12}}
                    containerStyle={{marginTop: 0, paddingTop: 0, borderWidth: 0, backgroundColor: colors.white}}
                  />
              )}
            </View>
          }

          {reason &&
            <View style={{flex: 1, backgroundColor: colors.white}}>
              <Text style={styles.category} onPress={this.dismiss}>
                {translate('report.describe_incident')}
              </Text>
              <TextInput
                multiline
                value={message}
                onChangeText={message => this.setState({message})}
                blurOnSubmit
                onFocus={() => this.setState({onlyText: true})}
                onBlur={this.dismiss}
                placeholder={translate('report.info')}
                style={styles.message}
              />
              <Button
                title={translate('report.send_report')}
                disabled={message.length < 50}
                containerStyle={{marginLeft: 10, marginBottom: 10, marginRight: 10}}
                buttonStyle={{backgroundColor: colors.green}}
                titleStyle={{fontSize: 14}}
                onPress={this.send}
              />
            </View>
          }
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Report))
