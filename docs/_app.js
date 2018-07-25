import React from 'react'
import RebassMDX from '@rebass/mdx'
import createScope from '@rebass/markdown'
import * as Rebass from 'rebass'
import sortBy from 'lodash.sortby'
import { Link } from 'react-router-dom'
import { Flex, Box, Container, Pre } from 'rebass'
import { SidebarLayout as Layout, ScopeProvider, LiveEditor, LivePreview } from '@compositor/x0/components'

const Logo = () => <img src="https://mdx-logo.now.sh" width="80" />

const Editor = props => {
  const lang = (props.className || '').replace(/^language\-/, '')
  const type = lang.charAt(0)
  const code = React.Children.toArray(props.children).join('\n')

  switch (type) {
    case '.':
      return (
        <LiveEditor
          mdx={lang === '.mdx'}
          code={code}
        />
      )
    case '!':
      return (
        <LivePreview
          mdx={lang === '!mdx'}
          code={code}
        />
      )
    default:
      return (
        <Pre
          p={3}
          mt={4}
          mb={4}
          bg='gray'
          children={props.children}
        />
      )
  }
}

const scope = { ...createScope(), ...Rebass, code: Editor, pre: ({ children }) => children }

const navOrder = [
  'index',
  'syntax',
  'components',
  'getting-started',
    'webpack',
    'parcel',
    'next',
    'create-react-app',
    'gatsby',
    'x0',
  'plugins',
    'markdown',
    'hyperscript',
  'advanced',
    'ast',
    'specification',
  'about'
]

const pageNames = {
  index: 'Introduction',
  next: 'Next.js',
  ast: 'AST',
  'getting-started': 'Getting Started',
  'create-react-app': 'Create React App'
}

const sortRoutes = routes => [
  ...sortBy([...routes], a => {
    const i = navOrder.indexOf(a.name)
    return i < 0 ? Infinity : i
  })
].map(route => {
  if (!pageNames[route.name]) return route
  return {
    ...route,
    name: pageNames[route.name]
  }
})

export default class App extends React.Component {
  static defaultProps = {
    title: 'MDX'
  }

  render () {
    const { routes } = this.props
    const nav = sortRoutes(routes)

    return (
      <RebassMDX>
        <ScopeProvider scope={scope}>
          <Layout
            {...this.props}
            logo={<Logo />}
            routes={nav}
          />
        </ScopeProvider>
      </RebassMDX>
    )
  }
}