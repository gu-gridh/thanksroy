const thanksRoySearchFixes = () => {
  function saveScrollPosition() {
    sessionStorage.setItem('scrollY', window.scrollY)
  }

  function restoreScrollPosition() {
    const savedScroll = sessionStorage.getItem('scrollY')

    if (savedScroll !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10))
        sessionStorage.removeItem('scrollY')
      }, 100)
    }
  }

  restoreScrollPosition()

  document.addEventListener('submit', function () {
    saveScrollPosition()
  }, true)

  function clearSearchInput(input) {
    if (!input.matches('input[type="search"], input[name="q"], input.search-query')) {
      return
    }

    if (input.value !== '') {
      return
    }

    const url = new URL(window.location.href)
    const inputName = input.getAttribute('name') || 'q'

    url.searchParams.delete(inputName)
    url.searchParams.delete('q')
    url.searchParams.delete('page')

    saveScrollPosition()
    window.location.href = url.toString()
  }

  document.addEventListener('search', function (e) {
    clearSearchInput(e.target)
  })

  document.addEventListener('input', function (e) {
    clearSearchInput(e.target)
  })

  $(document).on('change', '#search-facets select.chosen-select', function (event) {
    event.stopImmediatePropagation()

    const facet = $(this)
    const selectValues = facet.val()
    const selectName = facet.prop('name')

    if (!selectName) return

    const baseName = selectName.endsWith('[]')
      ? selectName.substring(0, selectName.length - 2)
      : selectName

    const url = new URL(window.location.href)

    Array.from(url.searchParams.keys()).forEach((key) => {
      if (
        key === baseName ||
        key === baseName + '[]' ||
        key.startsWith(baseName + '[')
      ) {
        url.searchParams.delete(key)
      }
    })

    if (Array.isArray(selectValues)) {
      selectValues.forEach((value, index) => {
        url.searchParams.set(baseName + '[' + index + ']', value)
      })
    } else if (selectValues) {
      url.searchParams.set(baseName, selectValues)
    }

    url.searchParams.delete('page')

    saveScrollPosition()
    window.location.href = url.toString()
  })

  document.addEventListener('click', function (e) {
    const button = e.target.closest('.range-double-submit')
    if (!button) return

    e.preventDefault()
    e.stopImmediatePropagation()

    const rangeDouble = button.closest('.range-double')
    if (!rangeDouble) return

    const fromNumeric = rangeDouble.querySelector('.range-numeric-from')
    const toNumeric = rangeDouble.querySelector('.range-numeric-to')
    const fromSlider = rangeDouble.querySelector('.range-slider-from')
    const toSlider = rangeDouble.querySelector('.range-slider-to')

    const fromName = fromSlider?.getAttribute('name')
    const toName = toSlider?.getAttribute('name')

    const fromValue = fromNumeric?.value || fromSlider?.value
    const toValue = toNumeric?.value || toSlider?.value

    const url = new URL(window.location.href)

    if (fromName) url.searchParams.set(fromName, fromValue)
    if (toName) url.searchParams.set(toName, toValue)

    url.searchParams.delete('page')

    saveScrollPosition()
    window.location.href = url.toString()
  }, true)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', thanksRoySearchFixes)
} else {
  thanksRoySearchFixes()
}