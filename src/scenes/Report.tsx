import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Picker,
  Text,
  View,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { withNavigationFocus } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'

import { Button, CheckBox } from 'react-native-elements'

import { foodsaver } from '../common/placeholder'
import report from '../common/report'

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
      }
    })

const placeholder = 'Es ist wichtig alle Fälle, die gegen die Verhaltensregeln verstoßen, zu melden, damit erst gar keine schlechte Stimmung unter den Foodsavern bzw. Betrieben entsteht. So können sich die Verantwortlichen rechtzeitig um Problemfälle kümmern und bei mehrfachem nicht angebrachtem Verhalten die Personen von der Plattform ausschließen. Bitte schildere den Vorfall in mindestens 120 Zeichen, damit die Verantwortlichen bzw. das Mediationsteam sich angemessen um den Fall kümmern können. Nenne dabei Häufigkeit des Vorfalls, Ort, Zeitpunkt und ggf. andere anwesende Foodsaver!'

type Props = {
  id: number

  actions: any
  foodsavers: any
  isFocused: boolean
}

class Report extends PureComponent<Props> {
  state = {
    reason: report[1],
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

  render() {
    const { foodsavers, id } = this.props
        , { reason, subreason, onlyText } = this.state
        , profile = foodsaver(foodsavers[id])

    const ReportPicker = ({label, onChange, reasons, selected}) =>
      <View>
        {!!label &&
          <Text style={styles.category}>
            {label}
          </Text>
        }
        <View style={{maxHeight: 90, paddingLeft: Platform.OS === 'android' ? 15 : 0, overflow: 'hidden', marginTop: 5}}>
          <Picker
            selectedValue={selected}
            itemStyle={{fontSize: 14}}
            style={[{width}, Platform.OS === 'ios' && {transform: [{translateY: -55}]}]}
            onValueChange={onChange}
          >
            {reasons.map(reason =>
              <Picker.Item key={`reason${reason.id}`} label={reason.name} value={reason.id} />
            )}
          </Picker>
        </View>
      </View>

    return (
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        enabled
        style={{flex: 1}}
      >
        <SafeAreaView style={styles.container}>
          {!onlyText && <ReportPicker
            label={`Warum möchtest Du ${profile.name} melden?`}
            selected={reason && reason.id}
            onChange={({}, index) => this.setState({reason: report[index]})}
            reasons={report}
          />}

          {!onlyText && reason && reason.children && reason.children.length &&
            <View style={{marginTop: 20}}>
              {reason.children.map(option =>
                option.children && option.children.length > 0 ?
                  <ReportPicker
                    key={'subreason' + option.id}
                    label=""
                    selected={subreason && subreason.id}
                    onChange={({}, index) => this.setState({subreason: option.children[index]})}
                    reasons={option.children}
                  /> :
                  <CheckBox
                    key={'subreason' + option.id}
                    title={option.name}
                    checked={false}
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
                Beschreibe den Vorfall noch etwas genauer!
              </Text>
              <TextInput
                multiline
                blurOnSubmit
                onFocus={() => this.setState({onlyText: true})}
                onBlur={this.dismiss}
                placeholder={placeholder}
                style={{
                  flex: 1,
                  fontSize: 14,
                  padding: 12,
                  paddingTop: 12,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: colors.gray,
                  margin: 10,
                  textAlignVertical: 'top'
                }}
              />
              <Button
                title="Meldung senden"
                containerStyle={{marginLeft: 10, marginBottom: 10, marginRight: 10}}
                buttonStyle={{backgroundColor: colors.green}}
                titleStyle={{fontSize: 14}}
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
