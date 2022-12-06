// import { useBreadcrumb } from '@oerlikon/breadcrumbs'
// import { useTranslation } from '@oerlikon/i18n'
import React, { useState } from 'react'
import Container from './Container'




export let Context = React.createContext<any>(null)

export function FactoryConfiguration() {
  let [type, setType] = useState('create')
  let [editRectGroup, setEditRectGroup] = useState(null)
  // const translate = useTranslation('pages.simulation.robotconfiguration')
  // useBreadcrumb({ path: '/simulation/robotconfiguration', label: translate('title') })
  return (
    <Context.Provider value ={{type, setType,editRectGroup, setEditRectGroup}}>
      <Container/>
    </Context.Provider>
    
  )
}
