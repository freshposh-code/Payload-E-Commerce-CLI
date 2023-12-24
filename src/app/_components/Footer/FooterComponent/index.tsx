'use client'

import React from 'react'

import classes from './index.module.scss'
import { inclusions, noHeaderFooterUrls } from '../../../constants'
import { usePathname } from 'next/navigation'
import { Gutter } from '../../Gutter'
import Image from 'next/image'
import Link from 'next/link'
import { Footer, Media } from '../../../../payload/payload-types'
import { Button } from '../../Button'

const FooterComponent = ({footer}: {footer: Footer}) => {
const pathname = usePathname();

const navItems = footer?.navItems || []

  return (
    <footer className={noHeaderFooterUrls.includes(pathname) ? classes.hide : ''}>
        <Gutter>
            <ul className={classes.inclusions}>
                {inclusions.map((inclusion) => (
                    <li key={inclusion.title}>
                        <Image src={inclusion.icon} alt='icons' width={36}
                        height={36} className={classes.icon} />

                        <h5 className={classes.title}>{inclusion.title}</h5>
                        <p>{inclusion.description}</p>
                    </li>
                ))}
            </ul>
        </Gutter>

        <div className={classes.footer}>
            <Gutter>
                <div className={classes.wrap}>
                    <Link href='/'>
                        <Image src='/logo-white.svg' alt='' width={170} height={50} />
                    </Link>

                    <p>{footer.copyright}</p>

                    <div className={classes.socialinks}>
                        {navItems.map((item) => {
                            const icon = item?.link.icon as Media

                            return (
                                <Button key={item.link.label}
                                el='link'
                                newTab={true}
                                href={item.link.url}
                                className={classes.socialinks}
                                >
                                    <Image src={icon?.url} alt='' width={24} height={24} className={classes.socialIcon} />
                                </Button>
                            )
                            })}
                    </div>
                </div>
            </Gutter>
        </div>
    </footer>
  )
}

export default FooterComponent