import type { FC } from 'react'
type CardProps = { title: string }
const Card: FC<CardProps> = ({ title }) => <h1>{title}</h1>
const Badge = ({ title }: CardProps) => <span>{title}</span> // flag
const format = (title: string): string => title.trim()
export { Badge, Card, format }
