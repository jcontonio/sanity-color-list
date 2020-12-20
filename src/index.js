/* eslint-disable complexity */
import React, {forwardRef} from 'react'
import PropTypes from 'prop-types'
import FormField from 'part:@sanity/components/formfields/default?'
import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event?'
import {getStaticKey} from './helpers'
import {isEqual, uniqueId} from 'lodash'
import {TinyColor} from '@ctrl/tinycolor'
import {List, ListItem, Pattern, Color, ConditionalWrapper, ToolTip} from './components'
import {studioTheme, ThemeProvider} from '@sanity/ui'

const createPatchFrom = value => PatchEvent.from(value === '' ? unset() : set(value))

const handleChange = ({prevValue, newValue, onChange}) => {
  if (newValue === prevValue) {
    onChange(createPatchFrom(undefined))
  } else {
    onChange(createPatchFrom(newValue))
  }
}

const getDisplayColor = ({tinycolor, color = {}}) => {
  if (typeof color === 'object') {
    return tinycolor.toRgbString()
  }

  return color
}

const createColors = ({typeName, activeValue, name, options, onChange, onFocus, readOnly}) => {
  const {
    list = [],
    tooltip,
    borderradius,
    background = '#FFFFFF',
    contrastcutoff = 20,
    lighten = 10,
    darken = 10,
    opacityThreshold = 0.2
  } = options || []
  const {inner = '100%', outer = '100%'} = borderradius || {}
  const bg = new TinyColor(background)
  const bgBrightness = bg?.getBrightness() || 255
  const bgAccent = bg?.isLight() ? bg?.darken(darken) : bg?.lighten(lighten)

  let colorList = list
  if (list instanceof Function) {
    colorList = list()
  }

  return colorList.map((color, i) => {
    if (!color.value) {
    // eslint-disable-next-line no-console
      console.error(
        'sanity-plugin-color-list could not find a color value. Please check your schema.'
      )
      return null
    }
    const currentColor = new TinyColor(color.value)
    if (!currentColor.isValid) {
    // eslint-disable-next-line no-console
      console.error(
        `sanity-plugin-color-list could not recognize the color: ${color.value}. Perhaps try another format.`
      )
      return null
    }

    const isLowContrast = Math.abs(bgBrightness - currentColor.getBrightness()) <= contrastcutoff
    const isLowAlpha = currentColor.getAlpha() < opacityThreshold

    const displayColor = getDisplayColor({
      tinycolor: currentColor,
      color: color.value,
    })
    const isActive = isEqual(activeValue, color)

    let decoratorColor = currentColor.isLight() ? currentColor.darken(darken) : currentColor.lighten(lighten)
    decoratorColor = isLowAlpha ? bgAccent : decoratorColor
    color.value = displayColor
    color._type = typeName

    return (
      <ConditionalWrapper
        key={getStaticKey(displayColor + i)}
        condition={tooltip}
        wrapper={children => <ToolTip title={color.title}>{children}</ToolTip>}
      >
        <ListItem
          isActive={isActive}
          decoratorColor={(isLowContrast || isLowAlpha) ? decoratorColor : displayColor}
          radius={outer}
        >
          <Pattern
            isActive={isActive}
          />
          <Color
            type="radio"
            role="radio"
            name={name}
            aria-label={color.title}
            aria-checked={isActive}
            tabindex={isActive || (!activeValue && i === 0) ? '0' : '-1'}
            disabled={readOnly}
            checked={isActive}
            value={color}
            onChange={() => handleChange({prevValue: activeValue, newValue: color, onChange})}
            onClick={() => handleChange({prevValue: activeValue, newValue: color, onChange})}
            onFocus={onFocus}
            isActive={isActive}
            radius={inner}
            hasOutline={isLowContrast || isLowAlpha}
            outlineColor={decoratorColor}
            fillColor={displayColor}
          />
        </ListItem>
      </ConditionalWrapper>
    )
  })
}

const ColorList = forwardRef((props, ref) => {
  const {onChange, level, value, type, readOnly, markers, onFocus, presence} = props
  const validation = markers.filter(marker => marker.type === 'validation')
  const groupName = uniqueId('ColorList')

  // console.debug('markers: ', markers)
  // console.debug('validation: ', validation)
  // console.debug('type: ', type)
  // console.debug('props: ', props)

  return (
    <FormField
      label={type.title}
      description={type.description}
      level={level}
      labelFor={groupName}
      markers={markers}
      presence={presence}
      onFocus={onFocus}
    >
      <ThemeProvider theme={studioTheme}>
        <List
          ref={ref}
          role="radiogroup"
          hasError={validation.length >= 1}
        >
          {createColors({typeName: type.name, activeValue: value, name: groupName, options: type.options, onChange, onFocus, readOnly})}
        </List>
      </ThemeProvider>
    </FormField>
  )
})

ColorList.displayName = 'ColorList'

ColorList.propTypes = {
  type: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    options: PropTypes.shape({
      background: PropTypes.string,
      borderradius: PropTypes.shape({
        outer: PropTypes.string,
        inner: PropTypes.string,
      }),
      contrastcutoff: PropTypes.number,
      lighten: PropTypes.number,
      darken: PropTypes.number,
      tooltip: PropTypes.bool,
      list: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,
  level: PropTypes.number,
  value: PropTypes.shape({
    value: PropTypes.string,
    title: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  onFocus: PropTypes.func,
  markers: PropTypes.array,
  presence: PropTypes.array,
}

ColorList.defaultProps = {
  level: undefined,
  value: undefined,
  onChange: undefined,
  readOnly: undefined,
  onFocus: undefined,
  onBlur: undefined,
  markers: undefined,
  presence: undefined,
}

export default ColorList
