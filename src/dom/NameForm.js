export default class NameForm {

  constructor (network, guestName) {
    this.network = network

    this.el = document.querySelector('section.overlay')

    this.form = this.el.querySelector('#name-form')
    this.form.addEventListener('submit', this.onSubmit.bind(this))

    this.nameEl = this.form.querySelector('input')
    this.setName( guestName )

    this.loading = false;
  }

  setName (name) {
    if (this.nameEl.value == "") {
      this.previousValue = name
      this.nameEl.value = name
    }
  }

  onSubmit (e) {
    e.preventDefault()

    // skip if loading
    if (this.loading) return false;

    // didn't wanted to change, just close
    if (this.nameEl.value === this.previousValue) {
      this.network.send(['start'])
      return this.close();
    } else {
      this.network.send(['name', this.nameEl.value])
      this.network.send(['start'])
      this.loading = true
    }

  }

  close () {
    this.el.classList.add('close')
  }

  open () {
    this.el.classList.remove('close')
  }

}
