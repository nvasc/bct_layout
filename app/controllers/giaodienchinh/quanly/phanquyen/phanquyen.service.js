function phanquyenService($state) {

  return {
    title: () => $state.current.name
  }

}
/* @ngInject */
export default phanquyenService;