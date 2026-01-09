import HomeClient from './HomeClient'

export const metadata = {
  title: 'RestorePro Services | 24/7 Emergency Restoration & Repair',
  description: '24/7 emergency restoration services for water damage, fire damage, mold remediation, plumbing, HVAC, and more. Fast response in 60 minutes or less.',
  openGraph: {
    title: 'RestorePro Services | 24/7 Emergency Restoration & Repair',
    description: '24/7 emergency restoration services for water damage, fire damage, mold remediation, plumbing, HVAC, and more. Fast response in 60 minutes or less.',
    type: 'website',
  },
}

export default function Home() {
  return <HomeClient />
}
