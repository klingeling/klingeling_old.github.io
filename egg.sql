set hive.exec.parallel=true;
set hive.exec.parallel.thread.number=32;

SET role admin;
ADD jar /opt/cloudbi/udf/getpropertynew.jar;
CREATE TEMPORARY FUNCTION getpropertynew AS 'com.huawei.cloudbi.hiveudf.GetJsonPropertyNew';


INSERT overwrite TABLE DWD_COUPON.t_coupon_base_info
select
    couponid,
    couponname,
    coupontype,
    facevalue,
    status,
    createdate,
    getdate,
    customerid,
    nvl(couponbalance, 0) as couponbalance,
    validdate,
    expiredate,
    isexpired,
    issuesceneid,
    issuescene,
    sourcetype,
    sourcetypeid,
    sourceid,
    nvl(recoveryamount, 0) as recoveryamount,
    coupon_templateId,
    if(
        budgetYear is not null and budgetYear != '',
        budgetYear,
        substr(createdate, 1, 4)
    ) as budgetYear,
    financialtype,
    accrualrule,
    createrid,
    couponHWProportions,
    InvoiceCustomerID,
    CashCouponProperty,
    invoicerule,
    ContractCode,
    promotionplanid,
    benefitProduct,
    couponIssuerProportions,
    benefitProject,
    orderLimitedAmount,
    CashCouponType,
    couponbaseinfo.bookkeepingEntityId as coupon_receive_cust_id,
    couponbaseinfo.contractingBody as contracting_party
from
    (
        select
            coupon.couponid,
            coupon.coupontype,
            nvl(coupon.facevalue, 0) as facevalue,
            coupon.customerid,
            coupon.createtime as createdate,
            coupon.activetime as getdate,
            coupon.validtime as validdate,
            coupon.expiretime as expiredate,
            if(
                from_unixtime(unix_timestamp(), 'yyyy-mm-dd hh:mm:ss') > coupon.expiretime,
                'true',
                'false'
            ) as isexpired,
            if(
                coupon.issuescene is null
                or coupon.issuescene = '',
                '100',
                coupon.issuescene
            ) as issuesceneid,
            coupon.sourceid,
            coupon.sourcetype as sourcetypeid,
            case
                when coupon.sourcetype = '1' then base64(encode('促销活动', 'utf-8'))
                when coupon.sourcetype = '2' then base64(encode('合作伙伴发券', 'utf-8'))
                when coupon.sourcetype = '3' then base64(encode('crm发券', 'utf-8'))
                when coupon.sourcetype = '4' then base64(encode('osm发券', 'utf-8'))
                when coupon.sourcetype = '5' then base64(encode('订单域发券', 'utf-8'))
                when coupon.sourcetype = '101' then base64(encode('事件活动', 'utf-8'))
                when coupon.sourcetype = '102' then base64(encode('抽奖活动', 'utf-8'))
                when coupon.sourcetype = '103' then base64(encode('云豆活动', 'utf-8'))
                when coupon.sourcetype = '104' then base64(encode('累计送活动', 'utf-8'))
                when coupon.sourcetype = '105' then base64(encode('定制优惠券', 'utf-8'))
                when coupon.sourcetype = '201' then base64(encode('合作伙伴域bp给客户发券', 'utf-8'))
                when coupon.sourcetype = '202' then base64(encode('合作伙伴域系统发券(技术测试类)', 'utf-8'))
            end as sourcetype,
            if(
                coupon.issuescene is not null
                and coupon.issuescene != 100
                and (
                    couponplan.planname is null
                    or couponplan.planname = ''
                ),
                issuescenecouponname.couponname,
                couponplan.planname
            ) as couponname,
            if(
                coupon.issuescene is not null
                and coupon.issuescene != 100,
                couponissuescenen.issuescenename,
                '促销活动'
            ) as issuescene,
            case
                when coupon.customerid = couponbalance.customerid and coupon.couponid = couponbalance.sourceid and couponbalance.couponstatus = 3 then couponbalance.amount / 100
                when coupon.customerid = couponbalance.customerid and coupon.couponid = couponbalance.sourceid and couponbalance.couponstatus != 3 then 0
                when (coupon.customerid != couponbalance.customerid or coupon.couponid != couponbalance.sourceid ) and coupon.backstatus = 3 then couponbalance.amount / 100
            end as recoveryamount,
            case
                when coupon.customerid = couponbalance.customerid and coupon.couponid = couponbalance.sourceid then couponbalance.couponstatus
                when (
                    coupon.customerid != couponbalance.customerid
                    or coupon.couponid != couponbalance.sourceid
                  ) and coupon.backstatus = 3 then 3
                when (coupon.customerid != couponbalance.customerid or coupon.couponid != couponbalance.sourceid ) and coupon.backstatus != 3 then
                    case
                        when coupon.status = 1 then -1
                        when coupon.status = 2 then 0
                        when coupon.status = 3 then 2
                    end
                end as status,
            case
                when coupon.customerid = couponbalance.customerid and coupon.couponid = couponbalance.sourceid then couponbalance.amount / 100
                when ( coupon.customerid != couponbalance.customerid or coupon.couponid != couponbalance.sourceid ) and coupon.couponType != 2 and (coupon.status = 1 or coupon.status = 2 ) then coupon.facevalue
                when ( coupon.customerid != couponbalance.customerid or coupon.couponid != couponbalance.sourceid ) and coupon.couponType != 2 and coupon.status = 3 then 0
            end as couponbalance,
            if(
                coupon.issuecoupontemplateid = '' or coupon.issuecoupontemplateid is null,
                '3',
                coupon.issuecoupontemplateid
            ) as coupon_templateId,
            coupon.budgetYear,
            --若券上有促销计划则为促销域内部发券，需取促销计划表里的账务属性，否则为外部发券，需要从发放场景表获取账务属性
            if(
                (coupon.promotionplanid is not null and trim(coupon.promotionplanid) <> ''),
                couponplan.financialtype,
                couponissuescenen.financialtype
            ) as financialtype,
            if(
                (coupon.promotionplanid is not null and trim(coupon.promotionplanid) <> ''),
                couponplan.accrualrule,
                couponissuescenen.accrualrule
            ) as accrualrule,
            coupon.createrid,
            coupon.couponHWProportions,
            case
                when coupon.coupontype <> 4 then ''
                when coupon.invoiceRule is null or coupon.invoiceRule in ('0', '2', '4') then coupon.sourceID
                when coupon.invoiceRule in ('3', '5') then coupon.CustomerId
                else ''
            end as InvoiceCustomerID,

            case
                when coupon.sourceBalanceTypeId = 'BALANCE_TYPE_DEBIT' then '1'
                when coupon.sourceBalanceTypeId = 'BALANCE_TYPE_CREDIT' then '2'
                when coupon.pickUpCouponFlag = '1' then '0'
                else ''
            end as CashCouponProperty, --现金券对应的属性 1-充值 2-信用
            coupon.invoiceRule as invoicerule,
            trim(coupon.ContractCode) as ContractCode,
            nvl(coupon.promotionplanid,'') as promotionplanid,
            if(coupon.promotionplanid is not null and coupon.promotionplanid <> '', 
                nvl(couponplan.benefitProduct,''),
                nvl(coupon.benefitProduct,'')) as benefitProduct,
            if(coupon.promotionplanid is not null and coupon.promotionplanid <> '', 
                nvl(couponplan.couponIssuerProportions,'1'),
                nvl(coupon.couponIssuerProportions,'1')) as couponIssuerProportions,
            if(coupon.promotionplanid is not null and coupon.promotionplanid <> '', 
                nvl(couponplan.benefitProject,''),
                nvl(coupon.benefitProject,'')) as benefitProject,
            if(coupon.promotionplanid is not null and coupon.promotionplanid <> '', 
                nvl(limitinfo.orderLimitedAmount,0),
                nvl(coupon.orderLimitedAmount,0)) as orderLimitedAmount,
            case
                when coupon.coupontype = 4 and coupon.pickUpCouponFlag = '1' then 'pick_up_coupon'
                when coupon.coupontype = 4  then 'gov_subsidy'
                else null
            end as CashCouponType,
            coupon.bookkeepingEntityId,
            coupon.contractingBody
        from
            (
                select
                    couponid,
                    coupontype,
                    facevalue,
                    customerid,
                    createtime,
                    activetime,
                    validtime,
                    expiretime,
                    issuescene,
                    sourceid,
                    sourcetype,
                    status,
                    issuecoupontemplateid,
                    '' as backstatus,
                    promotionplanid,
                    budgetYear,
                    financialtype,
                    nvl(couponHWProportions, 1) as couponHWProportions,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'invoiceRule', 'propertyKey', 'propertyValue')) as invoiceRule,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'sourceBalanceTypeId', 'propertyKey', 'propertyValue')) as sourceBalanceTypeId,
                    createrid,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'contractId', 'propertyKey', 'propertyValue')) as ContractCode,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'benefitProduct', 'propertyKey', 'propertyValue')) as benefitProduct,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'couponIssuerProportions', 'propertyKey', 'propertyValue')) as couponIssuerProportions,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'benefitProject', 'propertyKey', 'propertyValue')) as benefitProject,
                    if(COUPONUSELIMIT<> '' and substring(COUPONUSELIMIT,1,1)<>'[', null,getpropertynew(COUPONUSELIMIT, 'baseValue', 'limitKey', 'value1')) as orderLimitedAmount,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'pickUpCouponFlag', 'propertyKey', 'propertyValue')) as pickUpCouponFlag,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'bookkeepingEntityId', 'propertyKey', 'propertyValue')) as bookkeepingEntityId,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'contractingBody', 'propertyKey', 'propertyValue')) as contractingBody
                from
                    ods_promotion_coupon.t_mkt_coupon_v1

                union all

                select
                    couponid,
                    coupontype,
                    facevalue,
                    customerid,
                    createtime,
                    activetime,
                    validtime,
                    expiretime,
                    issuescene,
                    sourceid,
                    sourcetype,
                    status,
                    issuecoupontemplateid,
                    3 as backstatus,
                    promotionplanid,
                    budgetYear,
                    financialtype,
                    nvl(couponHWProportions, 1) as couponHWProportions,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'invoiceRule', 'propertyKey', 'propertyValue')) as invoiceRule,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'sourceBalanceTypeId', 'propertyKey', 'propertyValue')) as sourceBalanceTypeId,
                    createrid,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'contractId', 'propertyKey', 'propertyValue')) as ContractCode,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'benefitProduct', 'propertyKey', 'propertyValue')) as benefitProduct,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'couponIssuerProportions', 'propertyKey', 'propertyValue')) as couponIssuerProportions,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'benefitProject', 'propertyKey', 'propertyValue')) as benefitProject,
                    if(COUPONUSELIMIT<> '' and substring(COUPONUSELIMIT,1,1)<>'[', null,getpropertynew(COUPONUSELIMIT, 'baseValue', 'limitKey', 'value1')) as orderLimitedAmount,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'pickUpCouponFlag', 'propertyKey', 'propertyValue')) as pickUpCouponFlag,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'bookkeepingEntityId', 'propertyKey', 'propertyValue')) as bookkeepingEntityId,
                    if(extendProperties<> '' and substring(extendProperties,1,1)<>'[', null,getpropertynew(extendProperties, 'contractingBody', 'propertyKey', 'propertyValue')) as contractingBody
                from
                    ods_promotion_coupon.t_mkt_couponbackrecord_v1
            ) coupon
            left join ods_promotion_coupon.t_mkt_promotioncouponplan_v1 couponplan on coupon.promotionplanid = couponplan.promotionplanid
            left join ods_promotion_coupon.t_mkt_couponissuescene couponissuescenen on coupon.issuescene = couponissuescenen.issuescenevalue
            left join ods_promotion_coupon.t_mkt_issuescenecouponname issuescenecouponname
            on couponissuescenen.issuesceneid = issuescenecouponname.issuesceneid and coupon.coupontype = issuescenecouponname.coupontype and issuescenecouponname.lang = 'zh-cn'
            left join
            (
                select
                    distinct customerid,
                    sourceid,
                    amount,
                    couponstatus
                from
                    ods_bill_billingdeduct.t_billing_couponbalance
            ) couponbalance
            on (coupon.customerid = couponbalance.customerid and coupon.couponid = couponbalance.sourceid )
        left join 
            (
                select promotionplanid,max(value1) as orderLimitedAmount from ods_promotion_coupon.t_mkt_couponuselimitinfo
                where limitkey = 'baseValue'
                group by promotionplanid
            )
            limitinfo 
            on coupon.promotionplanid = limitinfo.promotionplanid
    ) couponbaseinfo
