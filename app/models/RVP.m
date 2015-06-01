function [ReidVP]=RVP(z,mixture_params,GCVOL_GC,Unifac_GC)
%Written by Jacob Backhaus/Updated by David Rothamer 12/12/2013
%Calculates the Reid Vapor Pressure from the conditions in ASTM D4953
%basis 1 mL of fuel. RVP reported is the DVPE calculated using correction
%in the ASTM D6738 test specification. The corrected value is given by DVPE
%= P_R=4 - Relative Bias. The Relative Bias is determined as the average
%values given for the 1 L and 250 mL fuel container sizes, i.e., Relative
%Bias = (1.005 kPa + 0.751 kPa)/2. 

T0=310.95; %Temperature of Reid Vapor Pressure test [K]
V_tot=5;    %total system volume for RVP test [mL]
%ratio of gas volume is 4 when fuel is introduced
V_gas=4;    %volume of gas [mL]
V_liq=1;    %volume of liquid [mL]
tol = 1E-06;
[~, ~, ~, ~, VP] = VTflash(z,T0,V_liq,V_tot,tol, mixture_params,GCVOL_GC,Unifac_GC);

% %The vapor pressure (VP) of the fuel without dissolved air is same as measured 
% %by ASTM D6378
% VP = sum(P_vap.*gamma.*xi);
% %ReidVP is the same as the dry vapor pressure equivalent (DVPE), to 
% %correct the VP to the DVPE the correction in ASTM D6378 is used
ReidVP=VP - (1.005+0.751)/2; %[kPa] DVPE

end

