DECLARE	
	vStatus INT;
	vErrorCode INT;	
	vErrorMsg varchar;
	vResult varchar;
	response json;
	
BEGIN
	vStatus = 0;
	if  porderid = null then
		vStatus = -1;
		vErrorCode = 9001;
		vErrorMsg = 'Invalid Parameters';
		SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg) INTO vResult;
	ELSE
	SELECT json_build_object('status',vStatus,
						 'result',array_agg(temp)) INTO vResult
						 FROM (SELECT *
						 FROM orders) temp
						 WHERE order_id = porderid;
						  RETURN vResult;
	END IF;
	

EXCEPTION WHEN OTHERS THEN
	vErrorCode = 120;
	vStatus = -1;
	GET STACKED DIAGNOSTICS vErrorMsg = MESSAGE_TEXT;
	SELECT json_build_object('status',vStatus,'error_code',vErrorCode,'error_msg',vErrorMsg,'result',null) into vResult;

	RETURN vResult;
END
