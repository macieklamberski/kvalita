import type { FC, PropsWithChildren } from 'react'
type CardProps = { title: string }
const Card: FC<CardProps> = ({ title }) => <h1>{title}</h1>
const Badge: FC<CardProps> = ({ title }) => <span>{title}</span> // flag
const Layout: FC<PropsWithChildren> = ({ children }) => <main>{children}</main>
export { Badge, Card, Layout }
