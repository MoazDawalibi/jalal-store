import { useLayoutEffect } from 'react'

const revealSelector = '[data-reveal]'

export function useScrollReveal() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const observed = new WeakSet<Element>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll(revealSelector).forEach((element) => {
        if (observed.has(element)) return
        observed.add(element)
        observer.observe(element)
      })
    }

    root.classList.add('reveal-ready')
    observe(document)

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches(revealSelector) && !observed.has(node)) {
            observed.add(node)
            observer.observe(node)
          }
          observe(node)
        })
      })
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      root.classList.remove('reveal-ready')
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [])
}
