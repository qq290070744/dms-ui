tag=`date +'%Y%m%d%H%M%S'`
yarn install
docker build -t harbor.mall.perfectdiary.com/base/dms-ui:${tag} .
docker push harbor.mall.perfectdiary.com/base/dms-ui:${tag}
