// import { useBreadcrumb } from '@oerlikon/breadcrumbs'
// import { useTranslation } from '@oerlikon/i18n'
import React, { useState } from 'react'
import Container from './ContainerRK'

export let Context = React.createContext<any>(null)

export function FactoryConfiguration() {
  let [type, setType] = useState('create')
  let [editRect, setEditRect] = useState(null)
  // const translate = useTranslation('pages.simulation.robotconfiguration')
  // useBreadcrumb({ path: '/simulation/robotconfiguration', label: translate('title') })
  return (
    <Context.Provider value ={{type, setType,editRect, setEditRect}}>
      <Container/>
    </Context.Provider>
    
  )
}
